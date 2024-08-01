import {
  ClientLoaderFunctionArgs,
  json,
  MetaFunction,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import localforage from "localforage";
import cloudflareR2API from "../client/components/api/cloudflareR2API";
import { v4 as uuidv4 } from "uuid";
import { Fragment } from "react/jsx-runtime";

interface EmojiDataType {
  emojiData?: {
    title: string;
    description: string;
    name: string;
    keywords: string[];
    languages: string[];
    story: string;
    unicode: string;
    url: string;
    combos: { code: string; baseUnicode: string; unicode: string }[];
    meanings: string[];
  };
}

export const meta: MetaFunction = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { emojiData }: EmojiDataType = data;

  if (!emojiData)
    return [
      { title: "Emoji" },
      { name: "description", content: "Welcome to Remix!" },
    ];

  return [
    {
      title: `${emojiData.title} - Emoji Meaning: ${emojiData.name} - ${emojiData.unicode} `,
    },
    { name: "description", content: `${emojiData?.description}` },
  ];
};

export const loader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.emoji) return redirect("/404");

  const unicode = params?.emoji?.split("_")[0];

  let emojiData = null;

  try {
    const response = await cloudflareR2API
      .get(`/emojis/${unicode.length < 9 ? unicode.slice(1) : unicode}.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);

    if (response) {
      emojiData = response;
    }
  } catch (error) {
    // If there is an error fetching the emoji filenames, log the error
    console.error("Error fetching emoji filenames:", error);
  }

  if (!emojiData) return redirect("/404");

  return json({ emojiData });
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
export async function clientLoader({
  serverLoader,
  params,
}: ClientLoaderFunctionArgs) {
  // Define the cache key for the emoji data file
  if (!params.emoji) return redirect("/404");

  const cacheKey = params?.emoji?.split("_")[0];

  try {
    // If the filenames are not cached, fetch them from the server and cache them
    const { emojiData }: { emojiData: EmojiDataType[] } = await serverLoader();

    // Check if the emojiData are already cached in local storage
    const cachedFilenames = await localforage.getItem<{
      emojiData: EmojiDataType[];
    }>(cacheKey);

    // If the emojiData are cached, return them
    if (cachedFilenames && (emojiData.length === 0 || !emojiData)) {
      return { emojiData: cachedFilenames };
    } else {
      // Cache the emojiData in local storage
      await localforage.setItem(cacheKey, emojiData);

      // Return the cached emojiData
      return { emojiData };
    }
  } catch (error) {
    // If there is an error fetching the cached filenames, log the error and continue to fetch the filenames from the server
    console.error("Error fetching cached filenames:", error);
  }
}

export default function Emoji() {
  const { emojiData } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="max-w-[1200px] flex flex-col font-lato tracking-widest leading-loose text-xl gap-10">
        {[emojiData].map((emoji) => (
          <Fragment key={uuidv4()}>
            <h2>
              {emoji.title} {emoji.unicode} {emoji.name}
            </h2>
            <p>{emoji.description}</p>
            <h2>
              Learn the meaning of {emoji.title} emoji (includes synonyms)
            </h2>
            <ul className="flex gap-5 flex-col">
              {" "}
              {emoji?.meanings?.map((meanings: string[]) => (
                <li key={uuidv4()}>{meanings}</li>
              ))}
            </ul>
            <h2>How to use {emoji.title} emoji in a sentence</h2>
            <ul>
              {" "}
              {emoji?.sentences?.map((sentences: string[]) => (
                <li key={uuidv4()}>{sentences}</li>
              ))}
            </ul>
            <h2>Fun Short Story using {emoji.title} emoji</h2>
            <ul className="flex flex-col gap-5">
              {emoji?.story.split("/n").map((paragraph: string) => (
                <li key={uuidv4()}>
                  <p>{paragraph}</p>
                </li>
              ))}
            </ul>
            <h2>
              Related Keywords to understand the emoji meaning of {emoji.title}
            </h2>
            <ul className="grid grid-cols-3 gap-4 justify-center items-center">
              {" "}
              {emoji?.keywords?.map((keywords: string[]) => (
                <li
                  key={uuidv4()}
                  className="border-2 flex justify-center items-center text-base py-1 px-1 rounded-lg text-center capitalize"
                >
                  {keywords}
                </li>
              ))}
            </ul>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
