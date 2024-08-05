import { useEffect, useState } from "react";
import { EmojiDataType } from "../../../routes/_index";
import Icon from "../utils/other/Icon";
import useManageCopiedMsg from "../hooks/useManageCopiedMsg";

// Function to copy an image URL to clipboard using native APIs
const copyImgToClipboard = async (
  url: string,
  setIsCopied: (value: string) => void
) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      if (context) {
        context.drawImage(img, 0, 0);

        // Wrap toBlob in a promise to use with await
        const blobPromise = new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => resolve(blob), "image/png");
        });

        const imgBlob = await blobPromise;

        if (imgBlob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": imgBlob }),
          ]);
          setIsCopied("true");
          setTimeout(() => setIsCopied(""), 2000); // Reset state after 2 seconds
        }
      }
    };
  } catch (error) {
    console.error("Failed to copy image to clipboard:", error);
    setIsCopied("");
  }
};

// Displays the combos for the selected emojis
function ComboImage({
  firstEmoji,
  secondEmoji,
  emojiData,
  thirdDiceRoll,
  setSecondEmoji,
  menuStyle,
}: {
  firstEmoji: string;
  secondEmoji: string;
  emojiData: EmojiDataType | undefined;
  setSecondEmoji: (value: string) => void;
  thirdDiceRoll?: () => void;
  menuStyle?: string;
}) {
  const [filteredCombos, setFilteredCombos] = useState<EmojiDataType["combos"]>([]);
  const { isCopied, setIsCopied } = useManageCopiedMsg();

  useEffect(() => {
    if (!firstEmoji || !secondEmoji) {
      setFilteredCombos([]);
      return;
    }

    let firstEmojiBaseUnicode = firstEmoji.split("~")[0];
    let secondEmojiBaseUnicode = secondEmoji.split("~")[0];

    if (firstEmojiBaseUnicode.length >= 9)
      firstEmojiBaseUnicode = "u" + firstEmojiBaseUnicode.split("-").join("-u");

    if (secondEmojiBaseUnicode.length >= 9)
      secondEmojiBaseUnicode = "u" + secondEmojiBaseUnicode.split("-").join("-u");

    if (firstEmojiBaseUnicode === "u00a9") firstEmojiBaseUnicode = "ua9";
    if (firstEmojiBaseUnicode === "u00ae") firstEmojiBaseUnicode = "uae";

    const filterComboSet = () => {
      return emojiData?.combos?.filter(
        (combo) =>
          (combo.baseUnicode === firstEmojiBaseUnicode &&
            combo.unicode.endsWith(secondEmojiBaseUnicode)) ||
          (combo.baseUnicode === secondEmojiBaseUnicode &&
            combo.unicode.endsWith(firstEmojiBaseUnicode))
      );
    };

    setFilteredCombos([...new Set(filterComboSet())]);

    if (filterComboSet()?.length === 0) {
      firstEmojiBaseUnicode += "-ufe0f";
      setFilteredCombos([...new Set(filterComboSet())]);
    }

    if (filterComboSet()?.length === 0) {
      firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
      secondEmojiBaseUnicode += "-ufe0f";
      setFilteredCombos([...new Set(filterComboSet())]);
    }

    const finalCombo = filterComboSet();

    if ((finalCombo && finalCombo?.length > 2) || finalCombo?.length === 0) {
      setTimeout(() => setSecondEmoji(""), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstEmoji, secondEmoji, emojiData, setSecondEmoji]);

  return (
    <div className="flex justify-center items-center">
      {filteredCombos.length > 0 &&
        Object.values(filteredCombos[0]).length > 0 && (
          <>
            <img
              className={`${
                isCopied ? "opacity-0" : "opacity-1"
              } flex w-12 md:w-20`}
              key={`${filteredCombos[0]?.unicode}-${filteredCombos[0]?.baseUnicode}-${filteredCombos[0]?.code}-combo-img`}
              loading="lazy"
              alt={`Combination of two emojis ${filteredCombos[0]?.unicode}`}
              src={`https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`}
            />
            {isCopied && (
              <h2 className="text-rose-500 absolute font-nunito text-lg py-[1em]">
                Copied!
              </h2>
            )}
          </>
        )}

      <div
        className={`absolute -bottom-10 scale-[.80] flex gap-5 sm:gap-6 ${menuStyle}`}
      >
        <button
          onClick={() => {
            filteredCombos &&
            filteredCombos[0] &&
            Object.values(filteredCombos[0]).length > 0
              ? copyImgToClipboard(
                  `https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`,
                  setIsCopied
                )
              : null;
          }}
          aria-label="Copy Emoji Combo"
          className="flex hover:scale-110"
        >
          <Icon
            icon="copy"
            customStyle="fill-rose-400 w-7"
            title="Copy Emoji Combo PNG"
          />
        </button>
        <button
          aria-label="Deselect Emoji"
          className="flex hover:scale-110"
          onClick={() => setSecondEmoji("")}
        >
          <Icon
            icon="deselect"
            customStyle="fill-rose-400 w-7"
            title="Deselect Emoji"
          />
        </button>
        <button
          onClick={thirdDiceRoll}
          aria-label="Random Emoji"
          className="flex hover:scale-110"
        >
          <Icon
            icon="dice"
            customStyle="fill-rose-400 w-7"
            title="Random Second Emoji"
          />
        </button>
      </div>
    </div>
  );
}

export default ComboImage;
