import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EmojiDataType, Filename } from "../../../routes/_index";
import useSearch from "../hooks/useSearch";
import SearchBar from "../ui/SearchBar";
import HandleDiceRoll from "../utils/generators/HandleDiceRoll";
import HandleCacheEmojiData from "../utils/requests/HandleCacheEmojiData";
import useWindowWidth from "../hooks/useWindowWidth";
import useLoadAnimation from "../hooks/useLoadAnimation";
import useBodyEventListeners from "../hooks/useBodyEventListeners";

interface PropType {
  isLoading: boolean;
  filenames?: Filename[];
  emojiData: EmojiDataType | undefined;
  setEmojiData: (value: EmojiDataType | undefined) => void;
  setFirstEmoji: (value: string) => void;
  firstEmoji: string;
  secondEmoji: string;
  setSecondEmoji: (value: string) => void;
}

const FirstEmojiWindow: React.FC<PropType> = ({
  isLoading,
  filenames,
  emojiData,
  firstEmoji,
  setEmojiData,
  setFirstEmoji,
}) => {
  const { searchEmoji, setSearchEmoji } = useSearch();
  const windowWidth = useWindowWidth();
  const { fadeAnim } = useLoadAnimation();
  const [displayLimit, setDisplayLimit] = useState<number>(145);
  useBodyEventListeners({ setDisplayLimit })

  useEffect(() => {
    if (windowWidth !== undefined) {
      setDisplayLimit(windowWidth < 1022 ? 88 : 145);
    }
  }, [windowWidth]); // Run effect when windowWidth changes

  const loadEmojiData = useCallback(
    async (emojiUnicode: string) => {
      if (emojiData?.unicode === emojiUnicode) return;
      await HandleCacheEmojiData(emojiUnicode);
    },
    [emojiData]
  );

  const handleDisplayCombos = useCallback(
    async (emojiUnicode: string, emoji: string) => {
      const emojiData = await HandleCacheEmojiData(emojiUnicode);
      setFirstEmoji(`${emojiUnicode}~${emoji}`);
      setEmojiData(emojiData);
    },
    [setFirstEmoji, setEmojiData]
  );

  const filteredFilenames = useMemo(() => {
    return filenames?.filter(
      (filename) =>
        filename?.id?.includes(searchEmoji) ||
        filename?.keys?.includes(searchEmoji.trim()) ||
        searchEmoji === ""
    );
  }, [filenames, searchEmoji]);


  return (
    <div
     
      className="flex flex-col h-[45vh] border-r-2 border-b-2 rounded-lg border-purple-100 lg:border-none md:h-[50vh] lg:h-[70.5vh]"
    >
      <SearchBar
        uniqueId="first"
        setSearchEmoji={setSearchEmoji}
        customStyle="md:-translate-x-6 md:pl-5 pr-3 md:pr-0 mb-1"
        customSearchEmojiStyle="translate-x-[1em]"
        placeholder="Search first emoji"
        customLabelStyle="pr-[0.55em] pl-0"
        searchEmoji={searchEmoji}
        handleDiceRoll={() => {
          filenames && setSearchEmoji(HandleDiceRoll({ filenames }));
        }}
      />
      <ul
        className={`grid ${fadeAnim} grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto sm:py-6 px-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 ${
          isLoading ? "opacity-30" : ""
        } pb-[4em] lg:pb-[13em]`}
      >
        {filteredFilenames?.map((filename: Filename, index) => {
          return index < displayLimit ? (
            <li
              title={`${filename.keys.split("~")[0]} ${
                filename.keys.split("~")[1]
              }`}
              aria-label={`${filename.keys.split("~")[0]} ${
                filename.keys.split("~")[1]
              }`}
              key={filename.id}
            >
              <button
                tabIndex={-1}
                onMouseEnter={() => loadEmojiData(filename.id)}
                onClick={() =>
                  handleDisplayCombos(
                    filename.id,
                    `${filename.keys.split("~")[0]}~${
                      filename.keys.split("~")[1]
                    }`
                  )
                }
                disabled={isLoading}
                className={`${
                  filename.id === firstEmoji.split("~")[0]
                    ? "border-purple-400 bg-purple-100"
                    : ""
                } flex justify-center items-center w-full hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-purple-400`}
              >
                <img
                  loading="lazy"
                  alt={`Emoji of ${filename.keys.split("~")[0]} ${filename.id}`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    filename.id.length < 9
                      ? filename.id.slice(1)
                      : filename.id.split("-").join("_")
                  }/emoji.svg`}
                />
              </button>
            </li>
          ) : null;
        })}
      </ul>
    </div>
  );
};

export default FirstEmojiWindow;
