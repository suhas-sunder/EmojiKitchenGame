import type { MetaFunction } from "@remix-run/node";
import localforage from "localforage";

import cloudflareR2API from "../client/api/cloudflareR2API";
import {
  ClientLoaderFunctionArgs,
  json,
  useLoaderData,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Icon from "../client/components/utils/other/Icon";
interface emojiDataType {
  title: string;
  name: string;
  keywords: string[];
  languages: string[];
  story: string;
  unicode: string;
  url: string;
  combos: { code: string; baseUnicode: string; unicode: string }[];
  meanings: string[];
}

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

export const loader = async () => {
  let filenames: { id: string; keys: string }[] = [];

  try {
    const response = await cloudflareR2API
      .get("/emojis/filenames.json", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
      });

    const parseRes = await response;

    if (parseRes) {
      filenames = parseRes;
    } else {
      console.log("Failed to fetch filenames for emoji!");
    }
  } catch (err) {
    let message: string;

    if (err instanceof Error) {
      message = err.message;
    } else {
      message = String(err);
    }

    console.error(message);
  }

  return json(
    { filenames },
    {
      headers: {
        "Cache-Control": "max-age=3600, public",
      },
    }
  );
};

/**
 * This function is responsible for fetching filenames (static json data) from the server and caching them in the browser.
 * It first checks if the filenames are already cached in local storage. If they are, it returns the cached filenames.
 * If they are not cached, it fetches the filenames from the server and caches them.
 *
 * @param {ClientLoaderFunctionArgs} args - An object containing the serverLoader function.
 * @returns {Promise<{ filenames: { id: string, keys: string }[] }>} - A promise that resolves to an object containing the filenames.
 * @throws {Error} - If there is an error fetching the filenames from the server or caching them in local storage.
 */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  // Define the cache key for the filenames
  const cacheKey = "filenames";

  try {
    // If the filenames are not cached, fetch them from the server and cache them
    const { filenames }: { filenames: { id: string; keys: string }[] } =
      await serverLoader();

    // Check if the filenames are already cached in local storage
    const cachedFilenames = await localforage.getItem<{
      filenames: { id: string; keys: string }[];
    }>(cacheKey);

    // If the filenames are cached, return them
    if (cachedFilenames && (filenames.length === 0 || !filenames)) {
      return { filenames: cachedFilenames };
    } else {
      // Cache the filenames in local storage
      await localforage.setItem(cacheKey, filenames);

      // Return the cached filenames
      return { filenames };
    }
  } catch (error) {
    // If there is an error fetching the cached filenames, log the error and continue to fetch the filenames from the server
    console.error("Error fetching cached filenames:", error);
  }
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const [searchEmoji, setSearchEmoji] = useState<string>("");
  const [searchSecondEmoji, setSearchSecondEmoji] = useState<string>("");
  const [emojiData, setEmojiData] = useState<emojiDataType>();
  const [firstEmoji, setFirstEmoji] = useState<string>();
  const [secondEmoji, setSecondEmoji] = useState<string>();
  const [thirdEmoji, setThirdEmoji] = useState<{ code: string; baseUnicode: string; unicode: string }[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * This function loads emoji data from the server or cache.
   * It first checks if the emoji data is already cached in local storage.
   * If it is, it returns the cached data.
   * If it is not cached, it fetches the data from the server and caches it. *
   * @param {string} emojiUnicode - The Unicode of the emoji to load.
   * @returns {Promise<{ id: string, keys: string }[] | undefined>} - A promise that resolves to an array of emoji data objects, or undefined if there was an error.
   */

  const handleCacheEmojiData = async (emojiUnicode: string) => {
    try {
      // Check if the emoji data is already cached in local storage
      const cachedEmojiData = await localforage.getItem<emojiDataType>(
        emojiUnicode
      );

      // If the emoji data is cached, save it to state
      if (cachedEmojiData) {
        return cachedEmojiData;
      } else {
        // If the emoji data is not cached, fetch it from the server, cache it, and save it to state
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
      // If there is an error fetching the emoji data, log the error
      console.error("Error fetching emoji data:", error);
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 justify-center items-center w-full max-w-[1500px] mx-auto">
        <div className="flex flex-col h-[20em] lg:h-[53em] border-r  border-b sm:border-hidden ">
          <input
            type="search"
            onChange={(e) => setSearchEmoji(e.target.value)}
            placeholder={"🔍 Search First Emoji"}
            className="flex  mx-5 border-2 border-purple-400 rounded-md py-1 my-2 px-5"
          />
          <ul
            className={`grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto py-6 px-1 scrollbar scrollbar-thumb-purple-500 hover:scrollbar-thumb-purple-400 ${
              isLoading && "opacity-30"
            }`}
          >
            {data.filenames.map((filename: { id: string; keys: string }) => {
              return filename?.keys?.includes(searchEmoji.trim()) ||
                searchEmoji === "" ? (
                <li
                  title={
                    filename.keys.split("~")[0] +
                    " " +
                    filename.keys.split("~")[1]
                  }
                  aria-label={
                    filename.keys.split("~")[0] +
                    " " +
                    filename.keys.split("~")[1]
                  }
                  key={filename?.id}
                >
                  <button
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
        <div className="flex flex-col h-[20em] lg:h-[53em] border-l border-b sm:border-hidden ">
          <input
            type="search"
            onChange={(e) => setSearchSecondEmoji(e.target.value)}
            placeholder="🔍 Search Second Emoji"
            className="flex  mx-5 border-2 border-purple-400 rounded-md py-1 my-2 px-5"
          />
          <ul className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 overflow-y-auto py-6 px-1  scrollbar scrollbar-thumb-purple-500 hover:scrollbar-thumb-purple-400">
            {emojiData?.combos
              ? [
                  ...new Set(
                    emojiData.combos.map((combos) => combos.baseUnicode)
                  ),
                ].map((secondEmojiFilename) => {
                  const keywords = data.filenames.filter(
                    (filename) => filename.id === secondEmojiFilename
                  )[0]?.keys;

                  return keywords?.includes(searchSecondEmoji.trim()) ? (
                    <li
                      title={
                        keywords.split("~")[0] + " " + keywords.split("~")[1]
                      }
                      aria-label={
                        keywords.split("~")[0] + " " + keywords.split("~")[1]
                      }
                      key={secondEmojiFilename + "combo-pair"}
                    >
                      <button
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
              : data?.filenames?.map(
                  (filename: { id: string; keys: string }) => {
                    return filename?.keys?.includes(searchSecondEmoji.trim()) ||
                      searchSecondEmoji === "" ? (
                      <li key={filename?.id}>
                        <button
                          onClick={() => setSecondEmoji(filename.id)}
                          disabled={!emojiData?.combos}
                          className={`flex justify-center items-center w-full hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-purple-400 opacity-30`}
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
                  }
                )}
          </ul>
        </div>
        <div className="flex flex-col h-[20em] col-span-2 lg:col-span-1 lg:h-[53em] border-l border-b sm:border-hidden ">
          <ul
            className={`${
              emojiData?.combos
                ? "grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-5"
                : "flex h-full"
            } justify-center items-center overflow-y-auto py-6 px-1 scrollbar scrollbar-thumb-rose-400 hover:scrollbar-thumb-rose-300`}
          >
            {emojiData?.combos ? (
              emojiData?.combos?.map(
                (filename: {
                  code: string;
                  baseUnicode: string;
                  unicode: string;
                }) => (
                  <li
                    title={filename?.unicode.split("_").join(" + ")}
                    aria-label={filename?.unicode.split("_").join(" + ")}
                    key={
                      filename?.code + filename?.baseUnicode + filename?.unicode
                    }
                  >
                    <button
                      className={`hover:scale-110 p-1 m-1 border-2 rounded-lg border-transparent hover:border-purple-500 ${
                        firstEmoji && secondEmoji && "opacity-30"
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
              <li className="flex flex-col justify-center items-center w-full gap-8 sm:gap-12 font-nunito text-xl sm:text-2xl px-5 text-center tracking-widest leading-loose text-rose-500">
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
        </div>
      </div>
      <ul className="flex fixed bottom-8 justify-center items-center w-full h-[12em] gap-6 bg-white">
        <li
          title={firstEmoji?.split("~")[1] + " " + firstEmoji?.split("~")[2]}
          className="flex relative border-2 rounded-2xl justify-center items-center p-4 border-dashed border-purple-500 min-h-[5em] min-w-[5em] -translate-y-3"
        >
          {firstEmoji && (
            <img
              className="flex w-20"
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
          <div className="absolute -bottom-8 scale-[.80] flex gap-3">
            <button className="hover:scale-110">
              <Icon icon="copy" customStyle="text-purple-500" title="Copy Emoji" />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => {
                setFirstEmoji("");
                setSecondEmoji("");
              }}
            >
              <Icon
                icon="deselect"
                customStyle="text-purple-500"
                title="Deselect Emoji"
              />
            </button>
            <button className="hover:scale-110">
              <Icon
                icon="dice"
                customStyle="text-purple-500"
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
              className="flex w-20"
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
          <div className="absolute -bottom-8 scale-[.80] flex gap-3">
            <button className="hover:scale-110">
              <Icon icon="copy" customStyle="text-purple-500" title="Copy Emoji" />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => setSecondEmoji("")}
            >
              <Icon
                icon="deselect"
                customStyle="text-purple-500"
                title="Deselect Emoji"
              />
            </button>
            <button className="hover:scale-110">
              <Icon
                icon="dice"
                customStyle="text-purple-500"
                title="Random Second Emoji"
              />
            </button>
          </div>
        </li>
        <li className="-translate-y-3">🟰</li>

        <li className="flex border-2 rounded-2xl justify-center items-center p-4 border-dashed border-rose-400 min-h-[5em] min-w-[5em] -translate-y-3">
          <div className="absolute -bottom-8 scale-[.80] flex gap-3">
            <button className="hover:scale-110">
              <Icon icon="copy" customStyle="text-rose-400" title="Copy Emoji" />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => setSecondEmoji("")}
            >
              <Icon
                icon="deselect"
                customStyle="text-rose-400"
                title="Deselect Emoji"
              />
            </button>
            <button className="hover:scale-110">
              <Icon
                icon="dice"
                customStyle="text-rose-400"
                title="Random Second Emoji"
              />
            </button>
          </div>
        </li>
      </ul>
    </>
  );
}
