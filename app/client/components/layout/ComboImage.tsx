import { useEffect, useState } from "react";
import { EmojiDataType } from "../../../routes/_index";
import Icon from "../utils/other/Icon";
import useManageCopiedMsg from "../hooks/useManageCopiedMsg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let copyImageToClipboard: any;

if (typeof window !== "undefined") {
  import("copy-image-clipboard").then((module) => {
    copyImageToClipboard = module.copyImageToClipboard;
  });
}

//Displays the combos for the selected emojis
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
  const [filteredCombos, setFilteredCombos] = useState<EmojiDataType["combos"]>(
    []
  );
  const { isCopied, setIsCopied } = useManageCopiedMsg();

  const copyImgToClipboard = async ({ url }: { url: string }) => {
    // Can be an URL too, but be careful because this may cause CORS errors
    copyImageToClipboard(url)
      .then(() => {
        setIsCopied("true");
      })
      .catch((e: { message: string }) => {
        setIsCopied("");
        console.log("Error: ", e.message);
      });
  };

  useEffect(() => {
    if (!firstEmoji || !secondEmoji) {
      setFilteredCombos([]);
      return;
    }

    // Extract the baseUnicode from the first and second emojis
    let firstEmojiBaseUnicode = firstEmoji.split("~")[0];
    let secondEmojiBaseUnicode = secondEmoji.split("~")[0];

    //Adjust for special images that have a uniquely long unicode value
    if (firstEmojiBaseUnicode.length >= 9)
      firstEmojiBaseUnicode = "u" + firstEmojiBaseUnicode.split("-").join("-u");

    if (secondEmojiBaseUnicode.length >= 9)
      secondEmojiBaseUnicode =
        "u" + secondEmojiBaseUnicode.split("-").join("-u");

    if (firstEmojiBaseUnicode === "u00a9") firstEmojiBaseUnicode = "ua9";

    if (firstEmojiBaseUnicode === "u00ae") firstEmojiBaseUnicode = "uae";

    const filterComboSet = () => {
      // Filter the combos based on the selected emojis
      // The filter condition checks if the baseUnicode of the combo includes either of the baseUnicode of the selected emojis
      return emojiData?.combos?.filter(
        (combo) =>
          (combo.baseUnicode === firstEmojiBaseUnicode &&
            combo.unicode.endsWith(secondEmojiBaseUnicode)) ||
          (combo.baseUnicode === secondEmojiBaseUnicode &&
            combo.unicode.endsWith(firstEmojiBaseUnicode))
      );
    };

    setFilteredCombos([...new Set(filterComboSet())]);
    if (filterComboSet()?.length !== 0) return;

    //Covers edge cases for wierdly formatted emojis codes
    if (filterComboSet()?.length === 0) {
      firstEmojiBaseUnicode = firstEmojiBaseUnicode + "-ufe0f";
      setFilteredCombos([...new Set(filterComboSet())]);
      if (filterComboSet()?.length !== 0) return;
    }

    //Covers edge cases for wierdly formatted emojis codes
    if (filterComboSet()?.length === 0) {
      firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
      secondEmojiBaseUnicode = secondEmojiBaseUnicode + "-ufe0f";
      setFilteredCombos([...new Set(filterComboSet())]);
      if (filterComboSet()?.length !== 0) return;
    }

    const finalCombo = filterComboSet();

    //If no combo image exists, it means the first image was changed while a stale second image (not a combo of first) remains in state so clear second image from state.
    //Also, if combos exceed 2, clear second image because it's likely not a proper combo. It can be 2 because of the edge case where the same Id can exist for the special unicode string that is longer than 9 chars.
    if ((finalCombo && finalCombo?.length > 2) || finalCombo?.length === 0) {
      setTimeout(() => setSecondEmoji(""), 500); //Prevents bad state call error where state is being updated while null ComboImage is being rendered
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstEmoji, secondEmoji, emojiData, setSecondEmoji]);

  // The map function creates an image element for each combo
  // The key of each image element is a combination of the combo's unicode, baseUnicode, and code
  return (
    <div className="flex justify-center items-center">
      {filteredCombos.length > 0 &&
        Object.values(filteredCombos[0]).length > 0 && (
          <>
            <img
              className={`${isCopied ? "hidden" : "flex"} w-12 md:w-20`}
              key={`${filteredCombos[0]?.unicode}-${filteredCombos[0]?.baseUnicode}-${filteredCombos[0]?.code}-combo-img`}
              loading="lazy"
              alt={`Combination of two emojis ${filteredCombos[0]?.unicode}`}
              src={`https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`}
            />
            {isCopied && (
              <h2 className="text-rose-500 font-nunito w-12 text-sm py-[1em]">
                Copied!
              </h2>
            )}
          </>
        )}

      <div
        className={`absolute -bottom-10 scale-[.80] flex gap-3 ${menuStyle}`}
      >
        <button
          onClick={() => {
            Object.values(filteredCombos[0]).length > 0
              ? copyImgToClipboard({
                  url: `https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`,
                })
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
