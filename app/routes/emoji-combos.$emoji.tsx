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
import Icon from "../client/components/utils/other/Icon";

interface EmojiDataType {
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
  sentences: string[];
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

function EmojiPreview({ emoji }: { emoji: EmojiDataType }) {
  return (
    <div className="max-w-[1200px] mx-5 flex sm:block flex-col sm:flex-row gap-12 sm:gap-0 text-center sm:text-left">
      <div className="float-left border-2 border-purple-200 pb-12 pt-6 -translate-y-2  px-10 mr-8  flex flex-col rounded-lg ">
        <h2 className="tracking-widest leading-relaxed uppercase font-lora flex justify-center items-center gap-2">
          <span className="text-2xl">{emoji.title}</span>(U+
          {emoji.unicode.slice(1)})
        </h2>
        <div className="flex flex-col justify-center mt-5 items-center gap-3">
          <img
            loading="lazy"
            title={emoji?.title + " " + emoji?.unicode}
            aria-label={emoji?.title + " " + emoji?.unicode}
            width={50}
            height={50}
            alt={`Emoji of ${emoji.title + " " + emoji.unicode}`}
            src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
              emoji?.unicode?.length < 9
                ? emoji?.unicode.slice(1)
                : emoji?.unicode.split("-").join("_")
            }/emoji.svg`}
          />
          <ul className="grid grid-cols-2 mt-3 gap-x-12 gap-y-8 text-base font-nunito justify-center items-center">
            <li
              className="flex justify-center items-center"
              title={`Copy ${emoji?.title} Image`}
            >
              <button className="flex gap-1 justify-between border-2 px-3 py-2 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400">
                {" "}
                <span>Copy</span>{" "}
                <span className="flex">
                  <Icon
                    icon="copy"
                    title="Copy Paste Icon"
                    customStyle="fill-purple-500 w-5 translate-y-[0.1rem]"
                  />
                </span>
              </button>
            </li>
            <li
              title={`Like ${emoji?.title} emoji`}
              className="flex justify-center items-center"
            >
              <button className="flex gap-1 justify-between border-2 px-3 py-2 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400">
                <span>Like</span>{" "}
                <span className="flex">
                  <Icon
                    icon="heart"
                    title="💖 Heart Icon (like)"
                    customStyle="fill-rose-500 w-5 translate-y-[0.1rem]"
                  />
                </span>
              </button>
            </li>
            <li
              className="flex col-span-2 justify-center items-center"
              title={`Copy ${emoji?.title} Emoji`}
            >
              <button className="flex gap-1 justify-between border-2 px-3 py-2 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400">
                {" "}
                <span>Copy Emoji</span>{" "}
                <span className="flex">{emoji?.title}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <p>{emoji.description}</p>
    </div>
  );
}

function EmojiDetails({ emoji }: { emoji: EmojiDataType }) {
  return (
    <div className="max-w-[1200px] my-10 flex gap-10 flex-col  text-xl leading-loose tracking-widest bg-white bg-opacity-[0.8] p-16 rounded-lg">
      <h2 className="tracking-widest leading-relaxed  font-lora capitalize text-3xl text-center">
        Learn the meaning of {emoji.title} emoji{" "}
        <span className="text-rose-500">(Includes synonyms)</span>
      </h2>
      <ul className="flex gap-5 flex-col">
        {" "}
        {emoji?.meanings?.map((meaning: string) => (
          <li key={uuidv4()}>
            <span className="text-rose-500 font-nunito">
              {meaning?.split(":")[0]}:{" "}
            </span>
            <span>{meaning?.split(":")[1]}</span>
          </li>
        ))}
      </ul>
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-3xl mt-5 text-center">
        How to use {emoji.title} emoji{" "}
        <span className="text-rose-500">in a sentence</span>
      </h2>
      <ul className="flex flex-col gap-5 text-center">
        {" "}
        {emoji?.sentences?.map((sentences: string) => (
          <li key={uuidv4()}>{sentences}</li>
        ))}
      </ul>
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-3xl mt-5 text-center">
        <span className="text-rose-500">Fun Short Story</span> using{" "}
        {emoji.title} emoji
      </h2>
      <ul className="flex flex-col gap-5 text-center">
        {emoji?.story.split("/n").map((paragraph: string) => (
          <li key={uuidv4()}>
            <p>{paragraph}</p>
          </li>
        ))}
      </ul>
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-3xl mt-3 text-center">
        <span className="text-rose-500">Related Keywords</span> to understand
        the emoji meaning of {emoji.title}
      </h2>
      <ul className="grid grid-cols-3 gap-4 justify-center items-center">
        {" "}
        {emoji?.keywords?.map((keywords: string) => (
          <li
            key={uuidv4()}
            className="flex justify-center items-center text-base font-nunito text-rose-500  py-1 px-1 rounded-lg text-center capitalize"
          >
            {keywords}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Emoji() {
  const { emojiData } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full font-lato justify-center items-center tracking-widest mt-12 leading-loose text-slate-600 text-lg gap-20">
      {[emojiData].map((emoji) => (
        <Fragment key={uuidv4()}>
          <EmojiPreview emoji={emoji} />
          <div className="bg-rose-50 w-full justify-center items-center py-10  flex ">
            <EmojiDetails emoji={emoji} />
          </div>
        </Fragment>
      ))}
    </div>
  );
}
