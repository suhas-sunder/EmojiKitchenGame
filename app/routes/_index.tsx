import type { MetaFunction } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo, useState } from "react";
import FirstEmojiWindow from "../client/components/layout/FirstEmojiWindow";
import SecondEmojiWindow from "../client/components/layout/SecondEmojiWindow";
import ThirdEmojiWindow from "../client/components/layout/ThirdEmojiWindow";
import Icon from "../client/components/utils/other/Icon";
import ComboImage from "../client/components/layout/ComboImage";
import useIsLoading from "../client/components/hooks/useIsLoading";
import HandleDiceRoll from "../client/components/utils/generators/HandleDiceRoll";
import HandleCacheEmojiData from "../client/components/utils/requests/HandleCacheEmojiData";
import useManageCopiedMsg from "../client/components/hooks/useManageCopiedMsg";
import useResponsive from "../client/components/hooks/useResponsive";

export type Filename = {
  id: string;
  keys: string;
};

interface RouteData {
  filenames?: Filename[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === "object" && data !== null && "filenames" in data;
}

export type EmojiDataType = {
  title: string;
  description: string;
  name: string;
  keywords: string[];
  languages: { countryAbb: string; country: string; name: string }[];
  story: string;
  unicode: string;
  url: string;
  combos: { code: string; baseUnicode: string; unicode: string }[];
  meanings: string[];
  sentences: string[];
};

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Emoji Kitchen Game 🥘👨‍🍳 Mix, Match, and Create Fun and Unique Emoji Combos for Creative Messaging! 🎉✨",
    },
    {
      name: "description",
      content:
        "Get creative with our Emoji Kitchen Game! 🍳👩‍🍳 Explore thousands of unique emoji combinations based on Google Gboard's emoji kitchen. Mix and match emojis to craft fun and unique combinations. Click and combine to discover endless emoji possibilities for your messages and social media posts. Start creating and share your favorite emoji combos today! 🎉📲",
    },
  ];
};

function EmojiDisplay({
  firstEmoji,
  secondEmoji,
  setFirstEmoji,
  setSecondEmoji,
  setEmojiData,
  emojiData,
  firstDiceRoll,
  secondDiceRoll,
  thirdDiceRoll,
}: {
  firstEmoji: string;
  secondEmoji: string;

  setFirstEmoji: (value: string) => void;
  setSecondEmoji: (value: string) => void;
  setEmojiData: (value: EmojiDataType | undefined) => void;
  emojiData: EmojiDataType | undefined;
  firstDiceRoll: () => void;
  secondDiceRoll: ({ newEmojiData }: { newEmojiData: EmojiDataType }) => void;
  thirdDiceRoll: () => void;
}) {
  const { isCopied, setIsCopied } = useManageCopiedMsg();
  const { isHidden, setIsHidden } = useResponsive();

  return (
    <ul
      className={`flex touch-none fixed border-t-2 border-t-purple-200 justify-center w-full gap-2 pt-1 pb-2 sm:gap-6 bg-white ${
        isHidden
          ? "h-0 translate-y-4 lg:translate-y-2 sm:translate-y-[1.2em] bottom-6 md:bottom-9 lg:bottom-6"
          : "h-auto bottom-6"
      }`}
    >
      <li className="absolute w-full bg-black max-w-[650px]">
        <button
          onClick={() => setIsHidden(!isHidden)}
          title={
            isHidden ? "👀 Show Emoji Combo Menu" : "🕶️ Hide Emoji Combo Menu"
          }
          className="absolute -top-[3.6rem] -right-3 z-10 mr-7 hover:bg-rose-400 bg-rose-100 rounded-t-lg p-2 text-3xl"
        >
          {!isHidden ? "🫣" : "😉"}
        </button>
      </li>
      <li
        title={firstEmoji?.split("~")[1] + " " + firstEmoji?.split("~")[2]}
        className={`${
          isHidden ? "hidden" : "flex"
        }  flex-col justify-center items-center `}
      >
        <div
          className={`${
            firstEmoji && "scale-110"
          } flex w-full sm:gap-11 gap-7 justify-center items-center pt-2 pb-4`}
        >
          <button
            onClick={() => {
              setIsCopied(firstEmoji?.split("~")[1]);
              navigator.clipboard.writeText(`${firstEmoji?.split("~")[1]}`);
            }}
            aria-label="Copy First Emoji"
            className="flex hover:scale-110"
          >
            <Icon
              icon="copy"
              customStyle="fill-purple-500 w-7"
              title={`Copy ${firstEmoji?.split("~")[1]} Emoji`}
            />
          </button>
          <button
            onClick={firstDiceRoll}
            aria-label="Random Emoji"
            className="flex hover:scale-110"
          >
            <Icon
              icon="dice"
              customStyle="fill-purple-500 w-7"
              title="Random Second Emoji"
            />
          </button>
        </div>
        <div className=" border-2 rounded-2xl  p-4 border-dashed flex relative flex-col justify-center items-center border-purple-500 min-h-[5em] min-w-[5em]">
          {firstEmoji && (
            <img
              loading="lazy"
              className={`${
                isCopied && isCopied === firstEmoji?.split("~")[1]
                  ? "opacity-0"
                  : "opacity-1"
              } flex w-12 md:w-20`}
              alt={`Emoji of ${firstEmoji?.split("~")[1]} ${
                firstEmoji?.split("~")[2]
              }`}
              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                firstEmoji?.split("~")[0].length < 9
                  ? firstEmoji?.split("~")[0].slice(1)
                  : firstEmoji?.split("~")[0].split("-").join("_")
              }/emoji.svg`}
            />
          )}
          {firstEmoji && isCopied && isCopied === firstEmoji?.split("~")[1] && (
            <h2 className="text-purple-600 absolute  font-nunito text-lg py-[1em]">
              Copied!
            </h2>
          )}
        </div>
        <div
          className={`${
            firstEmoji && "scale-110"
          } flex w-full sm:gap-11 gap-7 justify-center items-center pb-2 pt-4`}
        >
          <button
            onClick={() => {
              setIsCopied(firstEmoji?.split("~")[1]);
              navigator.clipboard.writeText(`${firstEmoji?.split("~")[1]}`);
            }}
            aria-label="Copy First Emoji"
            className="flex hover:scale-110"
          >
            <Icon
              icon="copy"
              customStyle="fill-purple-500 w-7"
              title={`Copy ${firstEmoji?.split("~")[1]} Emoji`}
            />
          </button>
          <button
            aria-label="Deselect Emoji"
            className="flex hover:scale-110"
            onClick={() => {
              setFirstEmoji("");
              setSecondEmoji("");
              setEmojiData(undefined);
            }}
          >
            <Icon
              icon="deselect"
              customStyle="fill-purple-500 w-7"
              title="Deselect Emoji"
            />
          </button>
        </div>
      </li>
      <li
        className={`${
          isHidden ? "hidden" : "flex"
        }  flex-col justify-center items-center `}
      >
        ➕
      </li>
      <li
        title={secondEmoji?.split("~")[1] + " " + secondEmoji?.split("~")[2]}
        className={`${
          isHidden ? "hidden" : "flex"
        }  flex-col justify-center items-center `}
      >
        <div
          className={`${
            secondEmoji && "scale-110"
          } flex w-full sm:gap-11 gap-7 justify-center items-center pt-2 pb-4`}
        >
          <button
            onClick={() => {
              setIsCopied(secondEmoji?.split("~")[1]);
              navigator.clipboard.writeText(`${secondEmoji?.split("~")[1]}`);
            }}
            aria-label="Copy Second Emoji"
            className="flex hover:scale-110"
          >
            <Icon
              icon="copy"
              customStyle="fill-purple-500 w-7"
              title={`Copy ${secondEmoji?.split("~")[1]} Emoji`}
            />
          </button>

          <button
            onClick={() =>
              emojiData && secondDiceRoll({ newEmojiData: emojiData })
            }
            aria-label="Random Emoji"
            className="flex hover:scale-110"
          >
            <Icon
              icon="dice"
              customStyle="fill-purple-500 w-7"
              title="Random Second Emoji"
            />
          </button>
        </div>
        <div className=" border-2 rounded-2xl  p-4 border-dashed flex relative flex-col justify-center items-center border-purple-500 min-h-[5em] min-w-[5em]">
          {secondEmoji && (
            <img
              loading="lazy"
              className={`${
                isCopied && isCopied === secondEmoji?.split("~")[1]
                  ? "opacity-0"
                  : "opacity-1"
              } w-12 md:w-20 flex`}
              alt={`Emoji of ${secondEmoji?.split("~")[1]} ${
                secondEmoji?.split("~")[2]
              }`}
              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                secondEmoji?.split("~")[0].length < 9
                  ? secondEmoji?.split("~")[0].slice(1)
                  : secondEmoji?.split("~")[0].split("-").join("_")
              }/emoji.svg`}
            />
          )}
          {secondEmoji &&
            isCopied &&
            isCopied === secondEmoji?.split("~")[1] && (
              <h2 className="text-purple-600 absolute font-nunito text-lg py-[1em]">
                Copied!
              </h2>
            )}
        </div>
        <div
          className={`${
            secondEmoji && "scale-110"
          } flex w-full sm:gap-11 gap-7 justify-center items-center pb-2 pt-4`}
        >
          <button
            onClick={() => {
              setIsCopied(secondEmoji?.split("~")[1]);
              navigator.clipboard.writeText(`${secondEmoji?.split("~")[1]}`);
            }}
            aria-label="Copy Second Emoji"
            className="flex hover:scale-110"
          >
            <Icon
              icon="copy"
              customStyle="fill-purple-500 w-7"
              title={`Copy ${secondEmoji?.split("~")[1]} Emoji`}
            />
          </button>
          <button
            aria-label="Deselect Emoji"
            className="flex hover:scale-110"
            onClick={() => setSecondEmoji("")}
          >
            <Icon
              icon="deselect"
              customStyle="fill-purple-500 w-7"
              title="Deselect Emoji"
            />
          </button>
        </div>
      </li>
      <li
        className={`${
          isHidden ? "hidden" : "flex"
        }  flex-col justify-center items-center `}
      >
        🟰
      </li>
      <li
        className={`flex border-2 rounded-2xl  justify-center items-center my-auto p-4 border-dashed border-rose-400 min-h-[5em] min-w-[5em] ${
          firstEmoji && secondEmoji && "lg:translate-x-5 md:scale-[1.4]"
        } ${isHidden ? "hidden" : "flex"}`}
      >
        <ComboImage
          firstEmoji={firstEmoji}
          secondEmoji={secondEmoji}
          emojiData={emojiData}
          containerStyle={`-translate-y-1 `}
          menuStyle={`-top-[3.3em] sm:gap-11 gap-7 justify-center  items-center ${
            secondEmoji && "md:scale-[0.8] md:-top-[2.9em]"
          }`}
          bottomMenuStyle={`-bottom-[3.7em]  ${
            secondEmoji &&
            "md:scale-[0.8] scale-110 md:-bottom-[3.37em] -bottom-[3.9em]"
          }`}
          setSecondEmoji={setSecondEmoji}
          thirdDiceRoll={thirdDiceRoll}
        />
      </li>
    </ul>
  );
}

export default function Index() {
  const matches = useMatches();

  // Use type guard to check if the data is of the expected type
  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  const { isLoading } = useIsLoading();

  const [emojiData, setEmojiData] = useState<EmojiDataType>();
  const [firstEmoji, setFirstEmoji] = useState<string>("");
  const [secondEmoji, setSecondEmoji] = useState<string>("");

  const handleDisplayCombos = async (emojiUnicode: string, emoji: string) => {
    const emojiData = await HandleCacheEmojiData(emojiUnicode);
    setFirstEmoji(emojiUnicode + "~" + emoji);

    setEmojiData(emojiData);
  };

  const firstDiceRoll = () => {
    if (!filenames) return;

    // Call the HandleDiceRoll function, passing in the filenames array as an argument,
    // and store the result in the randEmoji variable.
    const randEmoji = HandleDiceRoll({
      filenames,
    });

    // Filter the filenames array to get the filename that includes the randomly
    // selected emoji. The result is stored in the filename variable.
    const filename = filenames.filter((filename) =>
      filename.keys.includes(randEmoji)
    )[0];

    // Call the handleDisplayCombos function, passing in the id of the selected filename
    // and the concatenation of the first two values of the keys property of the selected
    // filename. The result of this function call is not stored.
    handleDisplayCombos(
      filename.id,
      filename.keys.split("~")[0] + "~" + filename.keys.split("~")[1]
    );

    return filename.id;
  };

  const secondDiceRoll = ({
    newEmojiData,
  }: {
    newEmojiData: EmojiDataType;
  }) => {
    // Check if the filenames array is not null or undefined
    if (!filenames) return;

    // Generate a random emoji by calling the HandleDiceRoll function
    // with the filter parameter set to the filenames array filtered by
    // the ids of the combos in the emojiData
    const randEmoji = HandleDiceRoll({
      filenames: filenames?.filter((filename) =>
        newEmojiData?.combos
          .map((combo) => combo.baseUnicode)
          .includes(filename.id)
      ),
    });

    // Filter the filenames array again to get the filename that includes
    // the randomly selected emoji
    const selectedFilename = filenames.filter((filename) =>
      filename.keys.includes(randEmoji)
    )[0];

    // Set the secondEmoji state with the id of the selected emoji
    setSecondEmoji(
      selectedFilename.id + "~" + selectedFilename.keys.split("~")[0]
    );
  };

  const thirdDiceRoll = async () => {
    setFirstEmoji("");
    setSecondEmoji("");
    const unicode = firstDiceRoll();

    if (!unicode) return;

    const newEmojiData = await HandleCacheEmojiData(unicode);
    secondDiceRoll({ newEmojiData });
  };

  return (
    <>
      <header>
        <h1 className="w-full flex justify-center items-center text-sm sm:text-base -translate-y-[0.3em] sm:translate-y-0 sm:mt-2 sm:mb-1 text-purple-700  font-lora">
          Emoji Kitchen Game
        </h1>
      </header>
      <main>
        <div className="grid relative grid-cols-2 lg:grid-cols-3 justify-center -translate-y-1 sm:translate-y-0 items-center w-full max-w-[1500px] mx-auto">
          <FirstEmojiWindow
            emojiData={emojiData}
            isLoading={isLoading}
            filenames={filenames}
            setEmojiData={setEmojiData}
            setFirstEmoji={setFirstEmoji}
            firstEmoji={firstEmoji}
            setSecondEmoji={setSecondEmoji}
            secondEmoji={secondEmoji}
          />
          <SecondEmojiWindow
            emojiData={emojiData}
            isLoading={isLoading}
            filenames={filenames}
            firstEmoji={firstEmoji}
            secondEmoji={secondEmoji}
            setSecondEmoji={setSecondEmoji}
          />
          <ThirdEmojiWindow
            emojiData={emojiData}
            firstEmoji={firstEmoji}
            setSecondEmoji={setSecondEmoji}
            secondEmoji={secondEmoji}
            thirdDiceRoll={thirdDiceRoll}
            filenames={filenames}
          />
        </div>

        <EmojiDisplay
          emojiData={emojiData}
          firstEmoji={firstEmoji}
          secondEmoji={secondEmoji}
          setFirstEmoji={setFirstEmoji}
          setSecondEmoji={setSecondEmoji}
          setEmojiData={setEmojiData}
          firstDiceRoll={firstDiceRoll}
          secondDiceRoll={secondDiceRoll}
          thirdDiceRoll={thirdDiceRoll}
        />
      </main>
    </>
  );
}
