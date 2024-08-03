import useSearch from "../hooks/useSearch";
import { EmojiDataType } from "../../../routes/_index";
import SearchBar from "../ui/SearchBar";
import HandleDiceRoll from "../utils/generators/HandleDiceRoll";

interface PropType {
  isLoading: boolean;
  filenames?: { id: string; keys: string }[];
  emojiData?: EmojiDataType;
  firstEmoji: string;
  secondEmoji: string;
  setSecondEmoji: (value: string) => void;
}

export default function SecondEmojiWindow({
  filenames,
  emojiData,
  firstEmoji,
  secondEmoji,
  setSecondEmoji,
}: PropType) {
  const { searchEmoji, setSearchEmoji } = useSearch();

  const handleDiceRoll = () => {
    {
      if (!filenames) return;
      const randEmoji = HandleDiceRoll({
        filenames: filenames?.filter((filename) =>
          emojiData?.combos
            .map((combo) => combo.baseUnicode)
            .includes(filename.id)
        ),
      });
      randEmoji && setSearchEmoji(randEmoji);
    }
  };

  return (
    <div className="flex flex-col h-[61vh] md:h-[66vh] lg:h-[70.5vh]">
      <SearchBar
        uniqueId="second"
        setSearchEmoji={setSearchEmoji}
        customStyle="pr-5 mb-1 md:-translate-x-4 -translate-x-5"
        placeholder="search second emoji"
        customLabelStyle="pl-[1.45em] pr-[1em]"
        searchEmoji={searchEmoji}
        handleDiceRoll={handleDiceRoll}
      />
      <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto py-6 px-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 pb-[4em] lg:pb-[13em]">
        {emojiData?.combos
          ? [
              ...new Set(
                emojiData.combos.map((combos) =>
                  combos.baseUnicode.split("-")[0] === firstEmoji?.split("~")[0]
                    ? combos.unicode.split("_")[1].split("-")[0]
                    : combos.baseUnicode.split("-")[0]
                )
              ),
            ].map((secondEmojiFilename) => {
              const keywords = filenames?.filter(
                (filename) => filename.id === secondEmojiFilename
              )[0]?.keys;

              if (secondEmojiFilename === firstEmoji?.split("~")[0])
                return null; //If the second emoji is the same as the first emoji, don't display it

              return keywords?.includes(searchEmoji.trim()) ? (
                <li
                  title={keywords.split("~")[0] + " " + keywords.split("~")[1]}
                  aria-label={
                    keywords.split("~")[0] + " " + keywords.split("~")[1]
                  }
                  key={secondEmojiFilename + "combo-pair"}
                >
                  <button
                    tabIndex={-1}
                    onClick={() =>
                      setSecondEmoji(
                        secondEmojiFilename +
                          "~" +
                          keywords.split("~")[0] +
                          "~" +
                          keywords.split("~")[1]
                      )
                    }
                    className={`${
                      secondEmojiFilename === secondEmoji.split("~")[0] &&
                      "border-purple-400 bg-purple-100"
                    } flex justify-center items-center w-full hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-purple-400`}
                  >
                    <img
                      loading="lazy"
                      alt={`Emoji of ${
                        keywords?.split("~")[0]
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
              ) : null;
            })
          : filenames?.map((filename: { id: string; keys: string }) => {
              return filename?.keys?.includes(searchEmoji.trim()) ||
                searchEmoji === "" ? (
                <li key={filename?.id}>
                  <button
                    disabled
                    className={`flex justify-center items-center w-full hover:scale-110 p-1 border-2 rounded-lg border-transparent opacity-30`}
                  >
                    <img
                      loading="lazy"
                      alt={`Emoji of ${filename?.keys?.split("~")[0]} ${
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
}
