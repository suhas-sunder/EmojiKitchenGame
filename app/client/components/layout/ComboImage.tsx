import { useEffect, useState } from "react";
import { EmojiDataType } from "../../../routes/_index";
import Icon from "../utils/other/Icon";
import useManageCopiedMsg from "../hooks/useManageCopiedMsg";

// Function to copy an image URL to clipboard using canvas and Clipboard API
const copyImgToClipboard = async (
  url: string,
  setIsCopied: (value: string) => void
) => {
  console.log("Starting copyImgToClipboard function");
  try {
    console.log("Fetching image from URL:", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    console.log("Image fetched, creating blob");
    const blob = await response.blob();
    if (!blob) {
      throw new Error("Failed to create blob from response");
    }

    console.log("Blob created, setting image source");
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = async () => {
      console.log("Image loaded, creating canvas");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        console.log("Image drawn on canvas");

        const imgBlob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob((blob) => {
            console.log("Blob from canvas created");
            resolve(blob);
          }, "image/png");
        });

        if (imgBlob) {
          try {
            // Ensure Clipboard API is supported
            if (navigator.clipboard && ClipboardItem) {
              const clipboardItem = new ClipboardItem({
                "image/png": imgBlob
              });

              console.log("ClipboardItem created");
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
            // Fallback to default image URL
            copyFallbackImage("https://www.honeycombartist.com/defaults/single-robot-typing-2.png", setIsCopied);
          }
        } else {
          console.error("Failed to create blob from canvas");
          setIsCopied("");
        }
      } else {
        console.error("Failed to get canvas context");
        setIsCopied("");
      }
    };

    img.onerror = (error) => {
      console.error("Failed to load image:", error);
      setIsCopied("");
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to copy image to clipboard:", error.message);
    } else {
      console.error("Failed to copy image to clipboard: Unknown error");
    }
    // Fallback to default image URL
    copyFallbackImage("https://www.honeycombartist.com/defaults/single-robot-typing-2.png", setIsCopied);
  }
};

// Function to copy a fallback image to clipboard
const copyFallbackImage = async (url: string, setIsCopied: (value: string) => void) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const clipboardItem = new ClipboardItem({
      "image/png": blob
    });

    await navigator.clipboard.write([clipboardItem]);
    console.log("Fallback image copied to clipboard");
    setIsCopied("true");
    setTimeout(() => setIsCopied(""), 2000); // Reset state after 2 seconds
  } catch (error) {
    console.error("Failed to copy fallback image to clipboard:", error);
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
    console.log("Effect triggered with:", { firstEmoji, secondEmoji, emojiData });

    if (!firstEmoji || !secondEmoji) {
      console.log("No emojis selected, clearing combos");
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
            console.log("Copy button clicked");
            if (filteredCombos && filteredCombos[0] && Object.values(filteredCombos[0]).length > 0) {
              copyImgToClipboard(
                `https://www.gstatic.com/android/keyboard/emojikitchen/${filteredCombos[0]?.code}/${filteredCombos[0]?.baseUnicode}/${filteredCombos[0]?.unicode}.png`,
                setIsCopied
              );
            } else {
              console.log("No combo available to copy");
              // Fallback to default image URL
              copyFallbackImage("https://www.honeycombartist.com/defaults/single-robot-typing-2.png", setIsCopied);
            }
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
