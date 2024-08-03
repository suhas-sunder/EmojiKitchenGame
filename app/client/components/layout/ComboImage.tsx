import { EmojiDataType } from "../../../routes/_index";

//Displays the combos for the selected emojis
function ComboImage({
  firstEmoji,
  secondEmoji,
  emojiData,
  setSecondEmoji,
}: {
  firstEmoji: string;
  secondEmoji: string;
  emojiData: EmojiDataType | undefined;
  setSecondEmoji: (value: string) => void;
}) {
  // If either of the selected emojis is not available, return an empty array
  if (!firstEmoji || !secondEmoji) {
    return [];
  }

  // Extract the baseUnicode from the first and second emojis
  let firstEmojiBaseUnicode = firstEmoji.split("~")[0];
  let secondEmojiBaseUnicode = secondEmoji.split("~")[0];

  //Adjust for special images that have a uniquely long unicode value
  if (firstEmojiBaseUnicode.length >= 9)
    firstEmojiBaseUnicode = "u" + firstEmojiBaseUnicode.split("-").join("-u");

  if (secondEmojiBaseUnicode.length >= 9)
    secondEmojiBaseUnicode = "u" + secondEmojiBaseUnicode.split("-").join("-u");

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

  let filteredCombos = filterComboSet();

  //Covers edge cases for wierdly formatted emojis codes
  if (filteredCombos?.length === 0) {
    firstEmojiBaseUnicode = firstEmojiBaseUnicode + "-ufe0f";
    filteredCombos = filterComboSet();
  }

  //Covers edge cases for wierdly formatted emojis codes
  if (filteredCombos?.length === 0) {
    firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
    secondEmojiBaseUnicode = secondEmojiBaseUnicode + "-ufe0f";
    filteredCombos = filterComboSet();
  }

  //If no combo image exists, it means the first image was changed while a stale second image (not a combo of first) remains in state so clear second image from state.
  //Also, if combos exceed 2, clear second image because it's likely not a proper combo. It can be 2 because of the edge case where the same Id can exist for the special unicode string that is longer than 9 chars.
  if (
    (filteredCombos && filteredCombos?.length > 2) ||
    filteredCombos?.length === 0
  ) {
    setTimeout(() => setSecondEmoji(""), 500); //Prevents bad state call error where state is being updated while null ComboImage is being rendered
    return null;
  }

  // The map function creates an image element for each combo
  // The key of each image element is a combination of the combo's unicode, baseUnicode, and code
  return Array.from(new Set(filteredCombos)).map((combo, index) =>
    index === 0 ? (
      <img
        className="flex w-12 md:w-20"
        key={`${combo.unicode}-${combo.baseUnicode}-${combo.code}-combo-img`}
        loading="lazy"
        alt={`Combination of two emojis ${combo.unicode}`}
        src={`https://www.gstatic.com/android/keyboard/emojikitchen/${combo.code}/${combo.baseUnicode}/${combo.unicode}.png`}
      />
    ) : null
  );
}

export default ComboImage;
