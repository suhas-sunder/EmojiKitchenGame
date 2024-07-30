import { useState } from "react";
import { emojiDataType } from "../../../routes/_index";

interface PropType {
  isLoading: boolean;
  filenames: { id: string; keys: string }[];
  emojiData: emojiDataType | undefined;
  firstEmoji: string;
  setSecondEmoji: (value: string) => void;
}

export default function SecondEmojiWindow({
  isLoading,
  filenames,
  emojiData,
  firstEmoji,
  setSecondEmoji,
}: PropType) {
  const [searchSecondEmoji, setSearchSecondEmoji] = useState<string>("");

  return (
    <div className="flex flex-col h-[17em] lg:h-[53em] border-l border-b sm:border-hidden ">
      <input
        type="search"
        disabled={isLoading}
        onChange={(e) => setSearchSecondEmoji(e.target.value)}
        placeholder="🔍 Search Second Emoji"
        className="flex  mx-5 border-2 border-purple-400 rounded-md py-1 my-2 px-5"
      />
      <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto py-6 px-1  sm:scrollbar scrollbar-none scrollbar-thumb-purple-500 hover:scrollbar-thumb-purple-400 pb-[4em] lg:pb-[13em]">
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
              const keywords = filenames.filter(
                (filename) => filename.id === secondEmojiFilename
              )[0]?.keys;

              if (secondEmojiFilename === firstEmoji?.split("~")[0])
                return null; //If the second emoji is the same as the first emoji, don't display it

              return keywords?.includes(searchSecondEmoji.trim()) ? (
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
                    className={`flex justify-center items-center w-full hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-purple-400`}
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
              return filename?.keys?.includes(searchSecondEmoji.trim()) ||
                searchSecondEmoji === "" ? (
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
