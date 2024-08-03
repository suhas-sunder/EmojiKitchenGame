import { json, MetaFunction, redirect } from "@remix-run/node";
import CopyPaste from "../client/components/ui/CopyPasteTextbox";
import cloudflareR2API from "../client/components/api/cloudflareR2API";
import {
  ClientLoaderFunctionArgs,
  Link,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import localforage from "localforage";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SectionMenu from "../client/components/navigation/SectionMenu";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "✂️ Emoji Copy And Paste - Cool Symbols & Cool Fonts & Cool Text for iOS, Android, Browsers, iPhone, and more!",
    },
    {
      name: "description",
      content:
        "Discover and easily copy a wide range of cool emojis, symbols, fonts, and text styles for use on iOS, Android, browsers, iPhones, and more! Enhance your messages, social media posts, and creative projects with our extensive collection of unique and fun characters.",
    },
  ];
};

interface TextFaces {
  [key: string]: string[];
}

export const loader = async () => {
  let symbols = null;

  try {
    const response = await cloudflareR2API
      .get(`/emojis/symbols.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);

    if (response) {
      symbols = response;
    }
  } catch (error) {
    // If there is an error fetching the emoji filenames, log the error
    console.error("Error fetching emoji filenames:", error);
  }

  if (!symbols || Object.keys(symbols).length === 0) return redirect("/404");

  return json({ symbols });
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
  const cacheKey = "symbols";

  try {
    // Check if the symbols are already cached in local storage
    const symbols = await localforage.getItem<{
      symbols: TextFaces;
    }>(cacheKey);

    // If the symbols are cached, return them
    if (symbols) {
      return { symbols };
    } else {
      // If the filenames are not cached, fetch them from the server and cache them
      const { symbols }: { symbols: TextFaces } = await serverLoader();

      // Cache the symbols in local storage
      await localforage.setItem(cacheKey, symbols);

      // Return the cached symbols
      return { symbols };
    }
  } catch (error) {
    // If there is an error fetching the cached filenames, log the error and continue to fetch the filenames from the server
    console.error("Error fetching cached filenames:", error);
  }
}

export default function EmojiCopyAndPaste() {
  const { symbols }: { symbols: TextFaces } = useLoaderData();

  const [isCopied, setIsCopied] = useState<string>("");

  const { setCopyText, displayCopyText, setDisplayCopyText } =
    useOutletContext<{
      copyText: string;
      setCopyText: Dispatch<SetStateAction<string>>;
      displayCopyText: string;
      setDisplayCopyText: Dispatch<SetStateAction<string>>;
    }>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      isCopied && setIsCopied("");
    }, 400);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <div className="flex flex-col gap-10 justify-center leading-loose tracking-widest items-center">
      <header>
        <h1 className=" font-lora text-center leading-loose text-purple-700 translate-y-10 text-2xl mx-5 sm:text-3xl">
          ✂️ Symbols, Emoji Copy And Paste
          <div id="symbols" className="-translate-y-[100em]"></div>
        </h1>
      </header>
      <main className="max-w-[1200px] my-10 flex gap-16 flex-col mb-52 justify-center items-center">
        <SectionMenu object={symbols} />
        {Object.keys(symbols).map((key) => (
          <section
            key={key}
            className="overflow-auto lg:overflow-hidden  pt-10 sm:px-10 scrollbar-thin border-2 rounded-lg border-rose-100 scrollbar-thumb-rose-700 scrollbar-track-rose-300 "
          >
            <h2 className="flex capitalize mb-8 font-lora w-full text-rose-400 justify-center items-center text-center text-2xl">
              {key}
            </h2>
            <ul className="text-2xl grid font-nunito grid-cols-4 sm:grid-cols-7 px-5 lg:grid-cols-12 xl:grid-cols-14 gap-5 w-full justify-center items-center">
              {symbols[key].map((symbol, index) => (
                <li title={symbol} key={symbol + index}>
                  <button
                    onClick={() => {
                      setCopyText(symbol);
                      setIsCopied(symbol);
                    }}
                    className={`${
                      isCopied === symbol ? "text-xs" : "text-4xl"
                    } border-2 px-3 py-2 rounded-md max-w-[5.4em] hover:scale-110 border-rose-200 text-rose-500 cursor-pointer justify-center items-center flex w-full hover:border-rose-400 hover:text-rose-500`}
                  >
                    {isCopied === symbol ? "Copied!" : symbol}
                    <div id={key} className="-translate-y-64"></div>
                  </button>
                </li>
              ))}
              <li className="col-span-4 sm:col-span-7 lg:col-span-12 xl:col-span-14 w-full justify-center items-center flex mt-20 mb-10 text-xl">
                {" "}
                <Link
                  className=" text-sky-600 text-center hover:text-sky-500 flex gap-1 sm:gap-5"
                  to="#symbols"
                >
                  <span className="scale-x-[-1]">☝️☝🏻☝🏼</span>Scroll To Menu
                  <span>☝🏽☝🏾☝🏿</span>
                </Link>
              </li>
            </ul>
          </section>
        ))}
        <CopyPaste
          displayCopyText={displayCopyText}
          setDisplayCopyText={setDisplayCopyText}
        />
      </main>
    </div>
  );
}
