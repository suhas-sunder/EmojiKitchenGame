import { useEffect, useState } from "react";
import { EmojiDataType } from "../../../routes/_index";
import Icon from "../utils/other/Icon";
import useManageCopiedMsg from "../hooks/useManageCopiedMsg";

// Function to copy an image Blob to clipboard using Clipboard API
const copyImgToClipboard = async (
  imageBlob: Blob,
  setIsCopied: (value: string) => void
) => {
  try {
    if (navigator.clipboard && ClipboardItem) {
      const clipboardItem = new ClipboardItem({
        "image/png": imageBlob,
      });

      await navigator.clipboard.write([clipboardItem]);

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
  bottomMenuStyle,
  containerStyle,
}: {
  firstEmoji: string;
  secondEmoji: string;
  emojiData: EmojiDataType | undefined;
  setSecondEmoji: (value: string) => void;
  thirdDiceRoll?: () => void;
  menuStyle?: string;
  bottomMenuStyle?: string;
  containerStyle?: string;
}) {
  const [filteredCombos, setFilteredCombos] = useState<EmojiDataType["combos"]>(
    []
  );
  const [imageBlobs, setImageBlobs] = useState<Map<string, Blob>>(new Map());
  const { isCopied, setIsCopied } = useManageCopiedMsg();

  useEffect(() => {
    // If either emoji is missing, clear the combos and image blobs
    if (!firstEmoji || !secondEmoji) {
      setFilteredCombos([]);
      setImageBlobs(new Map()); // Clear image blobs
      return;
    }

    // Function to fetch an image and store its blob in the state
    const fetchAndStoreImage = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const blob = await response.blob();
        if (blob) {
          setImageBlobs((prev) => new Map(prev).set(url, blob));
        }
      } catch (error) {
        console.error("Failed to fetch image:", error);
      }
    };

    // Function to filter emoji combos
    const filterComboSet = (firstUnicode: string, secondUnicode: string) => {
      return emojiData?.combos?.filter(
        (combo) =>
          (combo.baseUnicode === firstUnicode &&
            combo.unicode.endsWith(secondUnicode)) ||
          (combo.baseUnicode === secondUnicode &&
            combo.unicode.endsWith(firstUnicode))
      );
    };

    // Normalize and prepare emoji unicode
    const normalizeUnicode = (emoji: string) => {
      let baseUnicode = emoji.split("~")[0];
      if (baseUnicode.length >= 9) {
        baseUnicode = "u" + baseUnicode.split("-").join("-u");
      }
      return baseUnicode;
    };

    // Initialize base unicode values
    let firstEmojiBaseUnicode = normalizeUnicode(firstEmoji);
    let secondEmojiBaseUnicode = normalizeUnicode(secondEmoji);

    // Helper function to update combos
    const updateCombos = (firstUnicode: string, secondUnicode: string) => {
      const combos = filterComboSet(firstUnicode, secondUnicode);
      setFilteredCombos([...new Set(combos)]);
      return combos;
    };

    // Try different combinations
    const tryCombos = () => {
      let combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      if (combos?.length === 0) {
        firstEmojiBaseUnicode += "-ufe0f";
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
      if (combos?.length === 0) {
        firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
        secondEmojiBaseUnicode += "-ufe0f";
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
      if (combos?.length === 0) {
        firstEmojiBaseUnicode += "-ufe0f";
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
      if (combos?.length === 0) {
        firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
        const temp = secondEmojiBaseUnicode.split("-")[0];
        secondEmojiBaseUnicode = `${temp}_${firstEmojiBaseUnicode}-ufe0f`;
        firstEmojiBaseUnicode = temp;
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
      if (combos?.length === 0) {
        const temp = firstEmojiBaseUnicode;
        firstEmojiBaseUnicode = secondEmojiBaseUnicode.split("_")[1];
        secondEmojiBaseUnicode = `${firstEmojiBaseUnicode}_${temp}`;
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
      if (combos?.length === 0) {
        firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
        secondEmojiBaseUnicode = `${firstEmojiBaseUnicode}_${
          secondEmojiBaseUnicode.split("_")[1]
        }-ufe0f`;
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
      if (combos?.length === 0) {
        firstEmojiBaseUnicode += "-ufe0f";
        secondEmojiBaseUnicode = `${firstEmojiBaseUnicode}_${
          secondEmojiBaseUnicode.split("_")[1]
        }`;
        combos = updateCombos(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
      }
    };

    // Try different combinations
    tryCombos();

    // Handle the case when no combinations are found
    let combos = filterComboSet(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
    if (combos?.length === 0) {
      firstEmojiBaseUnicode = normalizeUnicode(secondEmoji);
      secondEmojiBaseUnicode = normalizeUnicode(firstEmoji);
      tryCombos();
    }
    combos = filterComboSet(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
    if (combos?.length === 0) {
      firstEmojiBaseUnicode = normalizeUnicode(secondEmoji).replace(
        /u00/g,
        "u"
      );
      secondEmojiBaseUnicode = normalizeUnicode(firstEmoji).replace(
        /u00/g,
        "u"
      );
      tryCombos();
    }
    combos = filterComboSet(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
    if (combos?.length === 0) {
      firstEmojiBaseUnicode = normalizeUnicode(firstEmoji).replace(/u00/g, "u");
      secondEmojiBaseUnicode = normalizeUnicode(secondEmoji).replace(
        /u00/g,
        "u"
      );
      tryCombos();
    }

    // Fetch and store image if a valid combo is found
    combos = filterComboSet(firstEmojiBaseUnicode, secondEmojiBaseUnicode);
    if (combos && combos?.length > 0) {
      const imageUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/${combos[0]?.code}/${combos[0]?.baseUnicode}/${combos[0]?.unicode}.png`;
      fetchAndStoreImage(imageUrl);
    }

    // If no valid combo is found, clear the second emoji with a delay
    if ((combos && combos?.length > 2) || combos?.length === 0) {
      setTimeout(() => setSecondEmoji(""), 500);
    }
  }, [
    firstEmoji,
    secondEmoji,
    setSecondEmoji,
    setFilteredCombos,
    emojiData,
    setImageBlobs,
  ]);

  const handleCopyClick = async () => {
    if (
      filteredCombos.length > 0 &&
      Object.values(filteredCombos[0]).length > 0
    ) {
      const imageUrl = `https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`;
      const blob = imageBlobs.get(imageUrl);

      if (blob) {
        await copyImgToClipboard(blob, setIsCopied);
      } else {
        console.error("Image blob not found");
      }
    } else {
      console.error("No combo available to copy");
    }
  };

  return (
    <div
      className={`flex relative justify-center  items-center ${containerStyle}`}
    >
      <div className="w-12 h-12">
        {filteredCombos.length > 0 &&
          Object.values(filteredCombos[0]).length > 0 && (
            <>
              <img
                className={`${
                  isCopied ? "opacity-0" : "opacity-1"
                } flex w-12 md:w-20 mt-1 `}
                key={`${filteredCombos[0]?.unicode}-${filteredCombos[0]?.baseUnicode}-${filteredCombos[0]?.code}-combo-img`}
                loading="lazy"
                alt={`Combination of two emojis ${filteredCombos[0]?.unicode}`}
                src={`https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`}
              />
              {isCopied && (
                <h2 className="text-rose-500 absolute font-nunito text-lg py-[1em] -translate-y-14 -translate-x-2">
                  Copied!
                </h2>
              )}
            </>
          )}
      </div>
      <div className={`absolute flex  ${menuStyle}`}>
        <button
          onClick={handleCopyClick}
          aria-label="Copy Emoji Combo"
          className="flex hover:scale-110"
        >
          <Icon
            icon="copy"
            customStyle="fill-rose-400 w-7"
            title="Copy Emoji As PN Image"
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
      <div className={`absolute  flex  ${bottomMenuStyle}`}>
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
        {/* <button
          onClick={handleCopyClick}
          aria-label="Copy Emoji Combo as text"
          className="flex hover:scale-110"
        >
          <Icon
            icon="copy"
            customStyle="fill-rose-400 w-7"
            title="Copy Emoji As Text"
          />
        </button> */}
      </div>
    </div>
  );
}

export default ComboImage;
