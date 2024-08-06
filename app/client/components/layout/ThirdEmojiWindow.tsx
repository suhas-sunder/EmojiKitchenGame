import { EmojiDataType, Filename } from "../../../routes/_index";
import ComboImage from "./ComboImage";

interface PropType {
  emojiData: EmojiDataType | undefined;
  firstEmoji: string;
  setSecondEmoji: (value: string) => void;
  secondEmoji: string;
  thirdDiceRoll?: () => void;
  filenames?: Filename[];
}

export default function ThirdEmojiWindow({
  emojiData,
  firstEmoji,
  setSecondEmoji,
  secondEmoji,
  thirdDiceRoll,
  filenames,
}: PropType) {
  if (!filenames) return null;

  const handleComboClick = (comboCodes: {
    code: string;
    baseUnicode: string;
    unicode: string;
  }) => {
    const baseUnicodeId = comboCodes.baseUnicode.split("-")[0];
    const unicodeId = comboCodes.unicode.split("_")[1].split("-")[0];

    const newEmojiId = baseUnicodeId === firstEmoji.split("~")[0]
      ? unicodeId
      : baseUnicodeId;

    const selectedFilename = filenames.find(
      (filename) => filename.id === newEmojiId
    );

    if (selectedFilename) {
      setSecondEmoji(
        `${newEmojiId}~${selectedFilename.keys.split("~")[0]}`
      );
    }
  };

  return (
    <div className="flex relative items-center flex-col col-span-2 lg:col-span-1 min-w-20 h-[100vh] md:h-[66vh] lg:h-[70.5vh] border-l border-b sm:border-hidden">
      {emojiData?.combos && (
        <div
          className={`hidden lg:flex justify-center items-center max-w-[30em] -translate-x-1 w-full rounded-lg gap-2 py-1 my-2 text-md text-purple-800 font-nunito ${
            firstEmoji && secondEmoji ? "!hidden" : ""
          }`}
        >
          <span
            className={`${emojiData.combos.length <= 200 ? "flex" : "hidden"}`}
          >
            🙃
          </span>
          <span
            className={`${emojiData.combos.length > 200 && emojiData.combos.length < 500 ? "flex" : "hidden"}`}
          >
            🙀
          </span>
          <span
            className={`${emojiData.combos.length > 500 && emojiData.combos.length < 600 ? "flex" : "hidden"}`}
          >
            😵
          </span>
          <span className={`${emojiData.combos.length > 600 ? "flex" : "hidden"}`}>
            💀
          </span>
          Total Combos <span className="scale-75">🟰</span> {emojiData.combos.length}
        </div>
      )}
      <ul
        className={`${
          emojiData?.combos
            ? "grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5"
            : "flex h-full"
        } overflow-y-auto w-full py-6 px-1 scrollbar-thin scrollbar-thumb-rose-400 scrollbar-track-rose-100 pb-[8em] ${
          emojiData?.combos ? "lg:pb-[13em]" : ""
        } ${firstEmoji && secondEmoji ? "!hidden" : ""}`}
      >
        {emojiData?.combos ? (
          emojiData.combos.map((comboCodes) => (
            <li
              key={`${comboCodes.code}${comboCodes.baseUnicode}${comboCodes.unicode}`}
            >
              <button
                tabIndex={-1}
                disabled={!!(firstEmoji && secondEmoji)}
                onClick={() => handleComboClick(comboCodes)}
                className={`hover:scale-110 p-1 m-1 border-2 rounded-lg border-transparent ${
                  !(firstEmoji && secondEmoji) ? "hover:border-rose-400" : ""
                }`}
              >
                <img
                  loading="lazy"
                  alt={`Combination of two emojis ${comboCodes.unicode}`}
                  src={`https://www.gstatic.com/android/keyboard/emojikitchen/${comboCodes.code}/${comboCodes.baseUnicode}/${comboCodes.unicode}.png`}
                />
              </button>
            </li>
          ))
        ) : (
          <li className="flex flex-col lg:pt-64 py-1 justify-start items-center w-full gap-2 sm:gap-12 font-nunito text-xl sm:text-2xl px-5 text-center tracking-widest leading-loose text-rose-500">
            <span className="hidden lg:flex gap-6 scale-[3] md:scale-[2.5]">
              <span>👈🏼</span>
              <span>🧑🏼‍🍳</span>
            </span>
            <span className="lg:hidden flex gap-10 scale-[3] md:scale-[2.5]">
              <span>☝🏼</span>
              <span>🧑🏼‍🍳</span>
            </span>
            <span>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Select an emoji from the first column & start cookin'!
            </span>
          </li>
        )}
      </ul>
      {firstEmoji && secondEmoji && (
        <div className="flex absolute justify-center items-center lg:top-32 p-12 scale-150">
          <div className="scale-[2.1] pt-10 lg:pt-0 md:scale-150 lg:scale-[2.5]">
            <ComboImage
              firstEmoji={firstEmoji}
              secondEmoji={secondEmoji}
              emojiData={emojiData}
              setSecondEmoji={setSecondEmoji}
              containerStyle="translate-y-1 lg:translate-y-8"
              menuStyle="scale-50 -top-[1.55em] scale-[.80] gap-16"
              bottomMenuStyle="scale-50 -bottom-[2.4em] scale-[.80] gap-16"
              thirdDiceRoll={thirdDiceRoll}
            />
          </div>
        </div>
      )}
    </div>
  );
}
