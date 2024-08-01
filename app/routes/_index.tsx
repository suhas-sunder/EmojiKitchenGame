import type { MetaFunction } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo, useState } from "react";
import FirstEmojiWindow from "../client/components/layout/FirstEmojiWindow";
import SecondEmojiWindow from "../client/components/layout/SecondEmojiWindow";
import ThirdEmojiWindow from "../client/components/layout/ThirdEmojiWindow";
import Icon from "../client/components/utils/other/Icon";
import ComboImage from "../client/components/layout/ComboImage";
import useIsLoading from "../client/hooks/useIsLoading";

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

export type emojiDataType = {
  title: string;
  name: string;
  keywords: string[];
  languages: string[];
  story: string;
  unicode: string;
  url: string;
  combos: { code: string; baseUnicode: string; unicode: string }[];
  meanings: string[];
};

export const meta: MetaFunction = () => {
  return [
    { title: "Emoji Kitchen Game" },
    {
      name: "description",
      content:
        "Explore thousands of unique emoji combinations based on google's emoji kitchen game!",
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
}: {
  firstEmoji: string;
  secondEmoji: string;
  setFirstEmoji: (value: string) => void;
  setSecondEmoji: (value: string) => void;
  setEmojiData: (value: emojiDataType | undefined) => void;
  emojiData: emojiDataType | undefined;
}) {
  return (
    <ul className="flex fixed bottom-6 justify-center items-center w-full h-[9em] sm:h-[12em] lg:h-[12.5em] gap-2 sm:gap-6 bg-white">
      <li
        title={firstEmoji?.split("~")[1] + " " + firstEmoji?.split("~")[2]}
        className="flex relative border-2 rounded-2xl justify-center items-center p-4 border-dashed border-purple-500 min-h-[5em] min-w-[5em] -translate-y-4 sm:-translate-y-5"
      >
        {firstEmoji && (
          <img
            className="flex w-12 md:w-20"
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
        <div className="absolute -bottom-10 scale-[.80] flex gap-3">
          <button aria-label="Copy Emoji" className="flex hover:scale-110">
            <Icon
              icon="copy"
              customStyle="fill-purple-500 w-7"
              title="Copy Emoji"
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
          <button aria-label="Random Emoji" className="flex hover:scale-110">
            <Icon
              icon="dice"
              customStyle="fill-purple-500 w-7"
              title="Random Second Emoji"
            />
          </button>
        </div>
      </li>
      <li className="-translate-y-3">➕</li>
      <li
        title={secondEmoji?.split("~")[1] + " " + secondEmoji?.split("~")[2]}
        className="flex relative border-2 rounded-2xl justify-center items-center p-4 border-dashed border-purple-500 min-h-[5em] min-w-[5em] -translate-y-3"
      >
        {secondEmoji && (
          <img
            className="flex w-12 md:w-20"
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
        <div className="absolute -bottom-10 scale-[.80] flex gap-3">
          <button aria-label="Copy Emoji" className="flex hover:scale-110">
            <Icon
              icon="copy"
              customStyle="fill-purple-500 w-7"
              title="Copy Emoji"
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
          <button aria-label="Random Emoji" className="flex hover:scale-110">
            <Icon
              icon="dice"
              customStyle="fill-purple-500 w-7"
              title="Random Second Emoji"
            />
          </button>
        </div>
      </li>
      <li className="-translate-y-3">🟰</li>
      <li className="flex border-2 rounded-2xl justify-center items-center p-4 border-dashed border-rose-400 min-h-[5em] min-w-[5em] -translate-y-3">
        <ComboImage
          firstEmoji={firstEmoji}
          secondEmoji={secondEmoji}
          emojiData={emojiData}
          setSecondEmoji={setSecondEmoji}
        />
        <div className="absolute -bottom-10 scale-[.80] flex gap-3">
          <button aria-label="Copy Emoji" className="flex hover:scale-110">
            <Icon
              icon="copy"
              customStyle="fill-rose-400 w-7"
              title="Copy Emoji"
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
          <button aria-label="Random Emoji" className="flex hover:scale-110">
            <Icon
              icon="dice"
              customStyle="fill-rose-400 w-7"
              title="Random Second Emoji"
            />
          </button>
        </div>
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

  const { isLoading } =  useIsLoading();

  const [emojiData, setEmojiData] = useState<emojiDataType>();
  const [firstEmoji, setFirstEmoji] = useState<string>("");
  const [secondEmoji, setSecondEmoji] = useState<string>("");

  return (
    <>
      <header>
        <h1 className="w-full flex justify-center gap-1 items-center text-base mt-2 mb-1 text-purple-700  font-lora top-0 ">
          Emoji Kitchen Game
        </h1>
      </header>
      <main>
        <div className="grid grid-cols-2 lg:grid-cols-3 justify-center items-center w-full max-w-[1500px] mx-auto">
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
            setSecondEmoji={setSecondEmoji}
          />
          <ThirdEmojiWindow
            emojiData={emojiData}
            firstEmoji={firstEmoji}
            setSecondEmoji={setSecondEmoji}
            secondEmoji={secondEmoji}
          />
        </div>
        <EmojiDisplay
          emojiData={emojiData}
          firstEmoji={firstEmoji}
          secondEmoji={secondEmoji}
          setFirstEmoji={setFirstEmoji}
          setSecondEmoji={setSecondEmoji}
          setEmojiData={setEmojiData}
        />
      </main>
    </>
  );
}
