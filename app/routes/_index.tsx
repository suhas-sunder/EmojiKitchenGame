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
import FirstEmojiWindow from "../client/components/layout/FirstEmojiWindow";
import SecondEmojiWindow from "../client/components/layout/SecondEmojiWindow";
import ThirdEmojiWindow from "../client/components/layout/ThirdEmojiWindow";

export interface emojiDataType {
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
  const { filenames }: { filenames: { id: string; keys: string }[] } =
    useLoaderData<typeof loader>();
  const [searchEmoji, setSearchEmoji] = useState<string>("");
  const [emojiData, setEmojiData] = useState<emojiDataType>();
  const [firstEmoji, setFirstEmoji] = useState<string>("");
  const [secondEmoji, setSecondEmoji] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleComboImage = () => {
    // If either of the selected emojis is not available, return an empty array
    if (!firstEmoji || !secondEmoji) {
      return [];
    }

    // Extract the baseUnicode from the first and second emojis
    let firstEmojiBaseUnicode = firstEmoji.split("~")[0];
    let secondEmojiBaseUnicode = secondEmoji.split("~")[0];

    //Adjust for special images that have a uniquely long unicode value
    if (firstEmojiBaseUnicode.length >= 9)
      firstEmojiBaseUnicode = "u" + firstEmojiBaseUnicode.split("-").join("-u");

    if (secondEmojiBaseUnicode.length >= 9)
      secondEmojiBaseUnicode =
        "u" + secondEmojiBaseUnicode.split("-").join("-u");

    const filterComboSet = () => {
      // Filter the combos based on the selected emojis
      // The filter condition checks if the baseUnicode of the combo includes either of the baseUnicode of the selected emojis
      return emojiData?.combos?.filter(
        (combo) =>
          (combo.baseUnicode.includes(firstEmojiBaseUnicode) &&
            combo.unicode.endsWith(secondEmojiBaseUnicode)) ||
          (combo.baseUnicode.includes(secondEmojiBaseUnicode) &&
            combo.unicode.endsWith(firstEmojiBaseUnicode))
      );
    };
    let filteredCombos = filterComboSet();

    //Covers edge cases for wierdly formatted emojis codes
    if (filteredCombos?.length === 0) {
      firstEmojiBaseUnicode = firstEmojiBaseUnicode + "-ufe0f";
      filteredCombos = filterComboSet();
    }

    //Covers edge cases for wierdly formatted emojis codes
    if (filteredCombos?.length === 0) {
      firstEmojiBaseUnicode = firstEmojiBaseUnicode.slice(0, -6);
      secondEmojiBaseUnicode = secondEmojiBaseUnicode + "-ufe0f";
      filteredCombos = filterComboSet();
    }

    //If no combo image exists, it means the first image was changed while a stale second image (not a combo of first) remains in state so clear second image from state.
    if (
      (filteredCombos && filteredCombos?.length > 1) ||
      filteredCombos?.length === 0
    ) {
      setSecondEmoji("");
      return null;
    }

    // The map function creates an image element for each combo
    // The key of each image element is a combination of the combo's unicode, baseUnicode, and code
    return Array.from(new Set(filteredCombos)).map((combo, index) =>
      index === 0 ? (
        <img
          className="flex w-12 md:w-20"
          key={`${combo.unicode}-${combo.baseUnicode}-${combo.code}-combo-img`}
          loading="lazy"
          alt={`Combination of two emojis ${combo.unicode}`}
          src={`https://www.gstatic.com/android/keyboard/emojikitchen/${combo.code}/${combo.baseUnicode}/${combo.unicode}.png`}
        />
      ) : null
    );
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 justify-center items-center w-full max-w-[1500px] mx-auto">
        <FirstEmojiWindow
          emojiData={emojiData}
          isLoading={isLoading}
          filenames={filenames}
          searchEmoji={searchEmoji}
          setSearchEmoji={setSearchEmoji}
          handleComboImage={handleComboImage}
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
          handleComboImage={handleComboImage}
          firstEmoji={firstEmoji}
          setSecondEmoji={setSecondEmoji}
          secondEmoji={secondEmoji}
        />
      </div>
      <ul className="flex fixed bottom-6 justify-center items-center w-full h-[8em] sm:h-[12em] gap-2 sm:gap-6 bg-white">
        <li
          title={firstEmoji?.split("~")[1] + " " + firstEmoji?.split("~")[2]}
          className="flex relative border-2 rounded-2xl justify-center items-center p-4 border-dashed border-purple-500 min-h-[5em] min-w-[5em] -translate-y-3"
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
            <button className="hover:scale-110">
              <Icon
                icon="copy"
                customStyle="text-purple-500 p-2"
                title="Copy Emoji"
              />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => {
                setFirstEmoji("");
                setSecondEmoji("");
                setEmojiData(undefined);
              }}
            >
              <Icon
                icon="deselect"
                customStyle="text-purple-500 p-2"
                title="Deselect Emoji"
              />
            </button>
            <button className="hover:scale-110">
              <Icon
                icon="dice"
                customStyle="text-purple-500 p-2"
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
            <button className="hover:scale-110">
              <Icon
                icon="copy"
                customStyle="text-purple-500 p-2"
                title="Copy Emoji"
              />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => setSecondEmoji("")}
            >
              <Icon
                icon="deselect"
                customStyle="text-purple-500 p-2"
                title="Deselect Emoji"
              />
            </button>
            <button className="hover:scale-110">
              <Icon
                icon="dice"
                customStyle="text-purple-500 p-2"
                title="Random Second Emoji"
              />
            </button>
          </div>
        </li>
        <li className="-translate-y-3">🟰</li>
        <li className="flex border-2 rounded-2xl justify-center items-center p-4 border-dashed border-rose-400 min-h-[5em] min-w-[5em] -translate-y-3">
          {handleComboImage()}
          <div className="absolute -bottom-10 scale-[.80] flex gap-3">
            <button className="hover:scale-110">
              <Icon
                icon="copy"
                customStyle="text-rose-400 p-2"
                title="Copy Emoji"
              />
            </button>
            <button
              className="hover:scale-110"
              onClick={() => setSecondEmoji("")}
            >
              <Icon
                icon="deselect"
                customStyle="text-rose-400 p-2"
                title="Deselect Emoji"
              />
            </button>
            <button className="hover:scale-110">
              <Icon
                icon="dice"
                customStyle="text-rose-400 p-2"
                title="Random Second Emoji"
              />
            </button>
          </div>
        </li>
      </ul>
    </>
  );
}
