import React, { useCallback, useMemo, useState } from "react";
import useSearch from "../hooks/useSearch";
import { EmojiDataType } from "../../../routes/_index";
import SearchBar from "../ui/SearchBar";
import HandleDiceRoll from "../utils/generators/HandleDiceRoll";
import useLoadAnimation from "../hooks/useLoadAnimation";
import useBodyEventListeners from "../hooks/useBodyEventListeners";

interface PropType {
  isLoading: boolean;
  filenames?: { id: string; keys: string }[];
  emojiData?: EmojiDataType;
  firstEmoji: string;
  secondEmoji: string;
  setSecondEmoji: (value: string) => void;
}

const SecondEmojiWindow: React.FC<PropType> = ({
  filenames,
  emojiData,
  firstEmoji,
  secondEmoji,
  setSecondEmoji,
}) => {
  const { searchEmoji, setSearchEmoji } = useSearch();
  const { fadeAnim } = useLoadAnimation();
  const [displayLimit, setDisplayLimit] = useState<number>(145);
  useBodyEventListeners({ setDisplayLimit });

  const handleDiceRoll = useCallback(() => {
    if (!filenames) return;

    const filteredFilenames = filenames.filter((filename) =>
      emojiData?.combos.map((combo) => combo.baseUnicode).includes(filename.id)
    );

    const randEmoji = HandleDiceRoll({ filenames: filteredFilenames });
    randEmoji && setSearchEmoji(randEmoji);
  }, [filenames, emojiData, setSearchEmoji]);

  const emojiCombos = useMemo(() => {
    if (!emojiData?.combos) return [];

    const comboSet = new Set(
      emojiData.combos.map((combo) =>
        combo.baseUnicode.split("-")[0] === firstEmoji.split("~")[0]
          ? combo.unicode.split("_")[1].split("-")[0]
          : combo.baseUnicode.split("-")[0]
      )
    );

    return Array.from(comboSet).filter(
      (combo) => combo !== firstEmoji.split("~")[0]
    );
  }, [emojiData, firstEmoji]);

  const filteredFilenames = useMemo(() => {
    if (!searchEmoji.trim()) return filenames || [];
    return (
      filenames?.filter(
        (filename) =>
          filename?.id?.includes(searchEmoji) ||
          filename.keys.includes(searchEmoji.trim())
      ) || []
    );
  }, [filenames, searchEmoji]);

  return (
    <div className="flex flex-col h-[45vh] md:h-[50vh] lg:h-[70.5vh] border-b-2 rounded-lg border-purple-100 lg:border-none border-l-2">
      <SearchBar
        uniqueId="second"
        setSearchEmoji={setSearchEmoji}
        customStyle="pr-2 mb-1 md:-translate-x-4 sm:pl-3 -translate-x-2"
        customSearchEmojiStyle="translate-x-[1em]"
        placeholder="Search second emoji"
        customLabelStyle="pr-[0.55em]"
        searchEmoji={searchEmoji}
        handleDiceRoll={handleDiceRoll}
      />
      <ul
        className={`${fadeAnim} grid w-full grid-cols-4 pt-1 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto sm:py-6 px-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 pb-[4em] lg:pb-[13em] `}
      >
        {emojiCombos.map((secondEmojiFilename) => {
          const keywords =
            filenames?.find((filename) => filename.id === secondEmojiFilename)
              ?.id +
            "~" +
            filenames?.find((filename) => filename.id === secondEmojiFilename)
              ?.keys;

          if (!keywords) return null;

          if (
            searchEmoji &&
            !keywords.split("~").join("").includes(searchEmoji)
          )
            return null;

          return (
            <li
              title={`${keywords.split("~")[0]} ${keywords.split("~")[1]}`}
              aria-label={`${keywords.split("~")[0]} ${keywords.split("~")[1]}`}
              key={`${secondEmojiFilename}-combo-pair`}
            >
              <button
                tabIndex={-1}
                onClick={() =>
                  setSecondEmoji(
                    `${secondEmojiFilename}~${keywords.split("~")[0]}~${
                      keywords.split("~")[1]
                    }`
                  )
                }
                className={`${
                  secondEmojiFilename === secondEmoji.split("~")[0]
                    ? "border-purple-400 bg-purple-100"
                    : ""
                } flex justify-center items-center w-full hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-purple-400`}
              >
                <img
                  loading="lazy"
                  alt={`Emoji of ${
                    keywords.split("~")[0]
                  } ${secondEmojiFilename}`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    secondEmojiFilename.length <= 13
                      ? secondEmojiFilename.split("-")[0].slice(1)
                      : secondEmojiFilename
                          .split("-")
                          .join("_")
                          .split("u")
                          .join("")
                  }/emoji.svg`}
                />
              </button>
            </li>
          );
        })}
        {!firstEmoji &&
          filteredFilenames.map((filename, index) => {
            return index < displayLimit ? (
              <li
                onMouseEnter={() => setDisplayLimit(1000)}
                onTouchStart={() => setDisplayLimit(1000)}
                key={filename.id}
              >
                <button
                  disabled
                  className="flex justify-center items-center w-full hover:scale-110 p-1 border-2 rounded-lg border-transparent opacity-30"
                >
                  <img
                    loading="lazy"
                    alt={`Emoji of ${filename.keys.split("~")[0]} ${
                      filename.id
                    }`}
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

export default SecondEmojiWindow;
