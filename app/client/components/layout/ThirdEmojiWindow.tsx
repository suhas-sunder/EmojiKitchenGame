import { EmojiDataType } from "../../../routes/_index";
import ComboImage from "./ComboImage";

interface PropType {
  emojiData: EmojiDataType | undefined;
  firstEmoji: string;
  setSecondEmoji: (value: string) => void;
  secondEmoji: string;
  thirdDiceRoll?: () => void;
}

export default function ThirdEmojiWindow({
  emojiData,
  firstEmoji,
  setSecondEmoji,
  secondEmoji,
  thirdDiceRoll,
}: PropType) {
  return (
    <div
      className={` flex relative items-center flex-col col-span-2 lg:col-span-1 min-w-20 h-[61vh] md:h-[66vh] lg:h-[70.5vh] border-l border-b sm:border-hidden`}
    >
      {emojiData?.combos && (
        <div
          className={`hidden lg:flex justify-center items-center border-dashed max-w-[30em] -translate-x-1 border-2 w-full border-rose-300 rounded-lg gap-2 py-1 my-2 text-md text-purple-800 font-nunito ${
            firstEmoji && secondEmoji && "!hidden"
          }`}
        >
          <span
            className={`${
              emojiData?.combos.length <= 200 ? "flex" : "hidden"
            } `}
          >
            🙃
          </span>
          <span
            className={`${
              emojiData?.combos.length > 200 && emojiData?.combos.length < 500
                ? "flex"
                : "hidden"
            }`}
          >
            🙀
          </span>{" "}
          <span
            className={`${
              emojiData?.combos.length > 500 && emojiData?.combos.length < 600
                ? "flex"
                : "hidden"
            }`}
          >
            😵
          </span>{" "}
          <span
            className={`${emojiData?.combos.length > 600 ? "flex" : "hidden"}`}
          >
            💀
          </span>
          Total Combos <span className="scale-75">🟰</span>{" "}
          {emojiData?.combos.length}{" "}
        </div>
      )}
      <ul
        className={`${
          emojiData?.combos
            ? "grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5"
            : "flex h-full"
        } justify-center items-center overflow-y-auto py-6 px-1 scrollbar-thin scrollbar-thumb-rose-400 scrollbar-track-rose-100 pb-[8em] ${
          emojiData?.combos && "lg:pb-[13em]"
        } ${firstEmoji && secondEmoji && "!hidden"}`}
      >
        {emojiData?.combos ? (
          emojiData?.combos?.map(
            (filename: {
              code: string;
              baseUnicode: string;
              unicode: string;
            }) => (
              <li
                key={filename?.code + filename?.baseUnicode + filename?.unicode}
              >
                <button
                  tabIndex={-1}
                  disabled={firstEmoji && secondEmoji ? true : false}
                  onClick={() => {
                    filename.baseUnicode.split("-")[0] ===
                    firstEmoji?.split("~")[0]
                      ? setSecondEmoji(
                          filename.unicode.split("_")[1].split("-")[0]
                        )
                      : setSecondEmoji(filename.baseUnicode.split("-")[0]);
                  }}
                  className={`hover:scale-110 p-1 m-1 border-2 rounded-lg border-transparent  ${
                    !(firstEmoji && secondEmoji) && "hover:border-rose-400"
                  }`}
                >
                  <img
                    loading="lazy"
                    alt={`Combination of two emojis ${filename?.unicode}`}
                    src={`https://www.gstatic.com/android/keyboard/emojikitchen/${filename?.code}/${filename?.baseUnicode}/${filename?.unicode}.png`}
                  />
                </button>
              </li>
            )
          )
        ) : (
          <li className="flex flex-col sm:pt-0 justify-center items-center w-full gap-8 sm:gap-12 font-nunito text-xl sm:text-2xl px-5 text-center tracking-widest leading-loose text-rose-500">
            <span className="hidden lg:flex flex-col scale-[3] md:scale-[2.5]">
              👈🏼🧑🏼‍🍳
            </span>
            <span className="lg:hidden flex flex-col scale-[3] md:scale-[2.5]">
              ☝🏼🧑🏼‍🍳
            </span>{" "}
            <span>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Select an emoji from the first column & start cookin'!
            </span>
          </li>
        )}
      </ul>
      {firstEmoji && secondEmoji && (
        <div className="flex absolute justify-center items-center lg:top-32 p-12  scale-150">
          <div className="scale-[2.1] pt-10 lg:pt-0  md:scale-150  lg:scale-[2.5]">
            {" "}
            <ComboImage
              firstEmoji={firstEmoji}
              secondEmoji={secondEmoji}
              emojiData={emojiData}
              setSecondEmoji={setSecondEmoji}
              menuStyle="scale-50 -translate-y-3"
              thirdDiceRoll={thirdDiceRoll}
            />
          </div>
        </div>
      )}
    </div>
  );
}
