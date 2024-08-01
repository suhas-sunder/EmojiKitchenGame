import { emojiDataType, Filename } from "../../../routes/_index";
import useSearch from "../hooks/useSearch";
import SearchBar from "../ui/SearchBar";
import HandleDiceRoll from "../utils/generators/HandleDiceRoll";
import HandleCacheEmojiData from "../utils/requests/HandleCacheEmojiData";

interface PropType {
  isLoading: boolean;
  filenames?: Filename[];
  emojiData: emojiDataType | undefined;
  setEmojiData: (value: emojiDataType | undefined) => void;
  setFirstEmoji: (value: string) => void;
  firstEmoji: string;
  secondEmoji: string;
  setSecondEmoji: (value: string) => void;
}

export default function FirstEmojiWindow({
  isLoading,
  filenames,
  emojiData,
  setEmojiData,
  setFirstEmoji,
}: PropType) {
  const { searchEmoji, setSearchEmoji } = useSearch();

  const loadEmojiData = async (emojiUnicode: string) => {
    if (emojiData?.unicode === emojiUnicode) return;
    HandleCacheEmojiData(emojiUnicode);
  };

  const handleDisplayCombos = async (emojiUnicode: string, emoji: string) => {
    const emojiData = await HandleCacheEmojiData(emojiUnicode);
    setFirstEmoji(emojiUnicode + "~" + emoji);

    setEmojiData(emojiData);
  };

  return (
    <div className="flex flex-col h-[17em] lg:h-[53em] border-r  border-b sm:border-hidden">
      <SearchBar
        uniqueId="first"
        setSearchEmoji={setSearchEmoji}
        customStyle="md:-translate-x-8 md:pl-5 pr-8 md:pr-0 mb-1"
        placeholder="search first emoji"
        customLabelStyle="pl-[1.45em] pr-[1em]"
        searchEmoji={searchEmoji}
        handleDiceRoll={() => {
          filenames && setSearchEmoji(HandleDiceRoll({ filenames }));
        }}
      />
      <ul
        className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto py-6 px-1 sm:scrollbar-thin scrollbar-none scrollbar-thumb-purple-500 scrollbar-track-purple-200 ${
          isLoading && "opacity-30"
        } pb-[4em] lg:pb-[13em]`}
      >
        {filenames?.map((filename: Filename) => {
          return filename?.keys?.includes(searchEmoji.trim()) ||
            searchEmoji === "" ? (
            <li
              title={
                filename.keys.split("~")[0] + " " + filename.keys.split("~")[1]
              }
              aria-label={
                filename.keys.split("~")[0] + " " + filename.keys.split("~")[1]
              }
              key={filename?.id}
            >
              <button
                tabIndex={-1}
                onMouseEnter={() => loadEmojiData(filename.id)}
                onClick={() =>
                  handleDisplayCombos(
                    filename.id,
                    filename.keys.split("~")[0] +
                      "~" +
                      filename.keys.split("~")[1]
                  )
                }
                disabled={isLoading}
                className="flex justify-center items-center w-full hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-purple-400"
              >
                <img
                  loading="lazy"
                  alt={`Emoji of ${filename?.keys?.split("~")[0]} ${
                    filename?.id
                  }`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    filename?.id?.length < 9
                      ? filename?.id.slice(1)
                      : filename?.id.split("-").join("_")
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
