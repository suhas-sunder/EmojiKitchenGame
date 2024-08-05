import { useEffect, useState } from "react";
import { EmojiDataType } from "../../../routes/_index";
import Icon from "../utils/other/Icon";
import useManageCopiedMsg from "../hooks/useManageCopiedMsg";

// Function to copy an image Blob to clipboard using Clipboard API
const copyImgToClipboard = async (imageBlob: Blob, setIsCopied: (value: string) => void) => {
  console.log("Starting copyImgToClipboard function");

  try {
    if (navigator.clipboard && ClipboardItem) {
      const clipboardItem = new ClipboardItem({
        "image/png": imageBlob
      });

      await navigator.clipboard.write([clipboardItem]);
      console.log("Image copied to clipboard");
      setIsCopied("true");
      setTimeout(() => setIsCopied(""), 2000); // Reset state after 2 seconds
    } else {
      throw new Error("Clipboard API or ClipboardItem is not supported");
    }
  } catch (clipboardError) {
    if (clipboardError instanceof Error) {
      console.error("Failed to write to clipboard:", clipboardError.message);
    } else {
      console.error("Failed to write to clipboard: Unknown error");
    }
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
  const [imageBlobs, setImageBlobs] = useState<Map<string, Blob>>(new Map());
  const { isCopied, setIsCopied } = useManageCopiedMsg();

  useEffect(() => {
    console.log("Effect triggered with:", { firstEmoji, secondEmoji, emojiData });

    if (!firstEmoji || !secondEmoji) {
      console.log("No emojis selected, clearing combos");
      setFilteredCombos([]);
      setImageBlobs(new Map()); // Clear image blobs
      return;
    }

    const fetchAndStoreImage = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const blob = await response.blob();
        if (blob) {
          setImageBlobs(prev => new Map(prev).set(url, blob));
        } else {
          console.error("Failed to create blob from response");
        }
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };

    const filterComboSet = () => {
      return emojiData?.combos?.filter(
        (combo) =>
          (combo.baseUnicode === firstEmojiBaseUnicode &&
            combo.unicode.endsWith(secondEmojiBaseUnicode)) ||
          (combo.baseUnicode === secondEmojiBaseUnicode &&
            combo.unicode.endsWith(firstEmojiBaseUnicode))
      );
    };

    let firstEmojiBaseUnicode = firstEmoji.split("~")[0];
    let secondEmojiBaseUnicode = secondEmoji.split("~")[0];

    if (firstEmojiBaseUnicode.length >= 9)
      firstEmojiBaseUnicode = "u" + firstEmojiBaseUnicode.split("-").join("-u");

    if (secondEmojiBaseUnicode.length >= 9)
      secondEmojiBaseUnicode = "u" + secondEmojiBaseUnicode.split("-").join("-u");

    if (firstEmojiBaseUnicode === "u00a9") firstEmojiBaseUnicode = "ua9";
    if (firstEmojiBaseUnicode === "u00ae") firstEmojiBaseUnicode = "uae";

    const combos = filterComboSet();
    console.log("Filtered combos:", combos);

    setFilteredCombos([...new Set(combos)]);

    if (combos?.length === 0) {
      firstEmojiBaseUnicode += "-ufe0f";
      setFilteredCombos([...new Set(filterComboSet())]);
    }

    if (combos?.length === 0) {
      firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
      secondEmojiBaseUnicode += "-ufe0f";
      setFilteredCombos([...new Set(filterComboSet())]);
    }

    const finalCombo = filterComboSet();
    console.log("Final combos:", finalCombo);

    if (finalCombo && finalCombo.length > 0) {
      const imageUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/${finalCombo[0]?.code}/${finalCombo[0]?.baseUnicode}/${finalCombo[0]?.unicode}.png`;
      fetchAndStoreImage(imageUrl);
    }

    if ((finalCombo && finalCombo.length > 2) || finalCombo?.length === 0) {
      setTimeout(() => setSecondEmoji(""), 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstEmoji, secondEmoji, emojiData, setSecondEmoji]);

  const handleCopyClick = async () => {
    console.log("Copy button clicked");
    if (filteredCombos.length > 0 && Object.values(filteredCombos[0]).length > 0) {
      const imageUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`;
      const blob = imageBlobs.get(imageUrl);

      if (blob) {
        await copyImgToClipboard(blob, setIsCopied);
      } else {
        console.log("Image blob not found");
      }
    } else {
      console.log("No combo available to copy");
    }
  };

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
          onClick={handleCopyClick}
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
