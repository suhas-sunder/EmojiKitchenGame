import { ReactNode } from "react";
import { emojiDataType, Filename } from "../../../routes/_index";
import cloudflareR2API from "../../../client/api/cloudflareR2API";
import localforage from "localforage";

interface PropType {
  isLoading: boolean;
  filenames?: Filename[];
  searchEmoji: string;
  setSearchEmoji: (value: string) => void;
  emojiData: emojiDataType | undefined;
  setEmojiData: (value: emojiDataType | undefined) => void;
  setFirstEmoji: (value: string) => void;
  firstEmoji: string;
  secondEmoji: string;
  setSecondEmoji: (value: string) => void;
  handleComboImage: () => ReactNode;
}

export default function FirstEmojiWindow({
  isLoading,
  filenames,
  searchEmoji,
  setSearchEmoji,
  emojiData,
  setEmojiData,
  setFirstEmoji,
}: PropType) {
  /**
   * This function loads emoji filenames from the server or cache.
   * It first checks if the emoji filenames is already cached in local storage.
   * If it is, it returns the cached filenames.
   * If it is not cached, it fetches the filenames from the server and caches it. *
   * @param {string} emojiUnicode - The Unicode of the emoji to load.
   * @returns {Promise<{ id: string, keys: string }[] | undefined>} - A promise that resolves to an array of emoji filenames objects, or undefined if there was an error.
   */

  const handleCacheEmojiData = async (emojiUnicode: string) => {
    try {
      // Check if the emoji filenames is already cached in local storage
      const cachedEmojiData = await localforage.getItem<emojiDataType>(
        emojiUnicode
      );

      // If the emoji filenames is cached, save it to state
      if (cachedEmojiData) {
        return cachedEmojiData;
      } else {
        // If the emoji filenames is not cached, fetch it from the server, cache it, and save it to state
        const response = await cloudflareR2API
          .get(
            `/emojis/${
              emojiUnicode.length < 9 ? emojiUnicode.slice(1) : emojiUnicode
            }.json`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => response.data);

        if (response) {
          await localforage.setItem(emojiUnicode, response);
          return response;
        }
      }
    } catch (error) {
      // If there is an error fetching the emoji filenames, log the error
      console.error("Error fetching emoji filenames:", error);
    }
  };

  const loadEmojiData = async (emojiUnicode: string) => {
    if (emojiData?.unicode === emojiUnicode) return;
    handleCacheEmojiData(emojiUnicode);
  };

  const handleDisplayCombos = async (emojiUnicode: string, emoji: string) => {
    const emojiData = await handleCacheEmojiData(emojiUnicode);
    setFirstEmoji(emojiUnicode + "~" + emoji);

    setEmojiData(emojiData);
  };

  return (
    <div className="flex flex-col h-[17em] lg:h-[53em] border-r  border-b sm:border-hidden">
      <input
        type="search"
        disabled={isLoading}
        onChange={(e) => setSearchEmoji(e.target.value)}
        placeholder={"🔍 Search First Emoji"}
        className="flex  mx-5 border-2 border-purple-400 rounded-md py-1 my-2 px-5"
      />
      <ul
        className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto py-6 px-1 sm:scrollbar scrollbar-none scrollbar-thumb-purple-500 hover:scrollbar-thumb-purple-400 ${
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
