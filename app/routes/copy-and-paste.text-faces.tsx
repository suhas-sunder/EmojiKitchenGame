import {
  ClientLoaderFunctionArgs,
  json,
  Link,
  MetaFunction,
  redirect,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import cloudflareR2API from "../client/components/api/cloudflareR2API";
import localforage from "localforage";

import { Dispatch, SetStateAction } from "react";
import CopyPaste from "../client/components/ui/CopyPasteTextbox";
import SectionMenu from "../client/components/navigation/SectionMenu";
import useManageCopiedMsg from "../client/components/hooks/useManageCopiedMsg";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Text Faces (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ - Copy and Paste Cute and Creative Text Emoticons!",
    },
    {
      name: "description",
      content:
        "Discover and share the cutest and most creative text faces! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Easily copy and paste a variety of unique emoticons for all your messages and social media posts. Express yourself with our extensive collection of fun text faces!",
    },
  ];
};

interface TextFaces {
  [key: string]: string[];
}

export const loader = async () => {
  let textFaces = null;
  let facesInfo = null;

  try {
    const response = await cloudflareR2API
      .get(`/emojis/text_faces.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);

    if (response) {
      textFaces = response;
    }
  } catch (error) {
    // If there is an error fetching the emoji filenames, log the error
    console.error("Error fetching emoji filenames:", error);
  }

  try {
    const response = await cloudflareR2API
      .get(`/emojis/faces_info.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);

    if (response) {
      facesInfo = response;
    }
  } catch (error) {
    // If there is an error fetching the emoji filenames, log the error
    console.error("Error fetching emoji filenames:", error);
  }

  if (!textFaces || Object.keys(textFaces).length === 0)
    return redirect("/404");

  return json({ textFaces, facesInfo });
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
  const cacheKey = "textFaces";
  const cacheKey1 = "facesInfo";

  try {
    // Check if the textFaces are already cached in local storage
    const textFaces = await localforage.getItem<{
      textFaces: TextFaces;
    }>(cacheKey);

    const facesInfo = await localforage.getItem<{
      facesInfo: TextFaces;
    }>(cacheKey1);

    // If the textFaces are cached, return them
    if (textFaces && facesInfo) {
      return { textFaces, facesInfo };
    } else {
      // If the filenames are not cached, fetch them from the server and cache them
      const {
        textFaces,
        facesInfo,
      }: { textFaces: TextFaces; facesInfo: TextFaces } = await serverLoader();

      // Cache the textFaces in local storage
      await localforage.setItem(cacheKey, textFaces);
      await localforage.setItem(cacheKey1, facesInfo);

      // Return the cached textFaces
      return { textFaces, facesInfo };
    }
  } catch (error) {
    // If there is an error fetching the cached filenames, log the error and continue to fetch the filenames from the server
    console.error("Error fetching cached filenames:", error);
  }
}

export default function TextFaces() {
  const {
    textFaces,
    facesInfo,
  }: { textFaces: TextFaces; facesInfo: TextFaces } = useLoaderData();

  const {
    isCopied,
    setIsCopied,
  } = useManageCopiedMsg();

  const {
    setCopyText,
    displayCopyText,
    setDisplayCopyText,
    textareaIsHidden,
    setTextareaIsHidden,
  } = useOutletContext<{
    copyText: string;
    setCopyText: Dispatch<SetStateAction<string>>;
    displayCopyText: string;
    setDisplayCopyText: Dispatch<SetStateAction<string>>;
    textareaIsHidden: boolean;
    setTextareaIsHidden: Dispatch<SetStateAction<boolean>>;
  }>();

  return (
    <div className="flex flex-col gap-5  justify-center items-center">
      <header>
        <h1 className="mt-10 font-lora text-center leading-loose text-purple-700 mb-5 text-2xl mx-5 sm:text-3xl">
          Copy and Paste Text Faces{" "}
          <span className="whitespace-nowrap">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span>
          <div id="text-faces" className="-translate-y-32"></div>
        </h1>
      </header>
      <main className="flex flex-col max-w-[1200px] gap-20 font-nunito justify-center items-center">
        <SectionMenu object={textFaces} />
        <div className="flex flex-col gap-14">
          {Object.entries(textFaces).map(([key, value], index) => (
            <div
              key={key + index + "faces"}
              className="-translate-y-6 flex flex-col  overflow-auto lg:overflow-hidden  pt-10 sm:px-10 scrollbar-thin border-2 rounded-lg border-slate-100 scrollbar-thumb-rose-700 scrollbar-track-rose-300"
            >
              <h2 className="flex capitalize mb-8  w-full text-rose-400 justify-center items-center text-center text-2xl">
                {key.split("-").join(" ")} Faces
              </h2>
              <ul className="grid sm:grid-cols-2  md:grid-cols-3 xl:grid-cols-5 gap-5 text-2xl justify-center items-center">
                {value.map((face, index) => (
                  <li
                    className="flex sm:whitespace-nowrap justify-center items-center "
                    title={face}
                    key={key + face + index + "face"}
                  >
                    <button
                      aria-label={`Copy ${face} face to clipboard`}
                      onClick={() => {
                        setIsCopied(face);
                        setCopyText(face);
                      }}
                      className={`hover:text-slate-800 flex text-center hover:scale-110 text-slate-600 border-slate-300 hover:border-slate-400  w-full justify-center items-center border-2 sm:px-5 py-4 rounded-md`}
                    >
                      {isCopied === face ? "✧･ﾟ Copied! ･ﾟ✧" : face}
                      <div id={key} className="-translate-y-44"></div>
                    </button>
                  </li>
                ))}

                <li className="sm:col-span-2 md:col-span-3 xl:col-span-5 w-full justify-center items-center flex mt-10 mb-20 text-xl">
                  {" "}
                  <Link
                    aria-label="Scroll To Menu"
                    className=" text-sky-600 translate-y-8 text-center hover:text-sky-500 flex gap-1 sm:gap-5"
                    to="#text-faces"
                  >
                    <span className="scale-x-[-1]">☝️☝🏻☝🏼</span>Scroll To Menu
                    <span>☝🏽☝🏾☝🏿</span>
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
        <ul className="flex gap-10  mb-40  flex-col mx-5">
          {Object.entries(facesInfo).map(([key, value], index) => (
            <li
              key={key + index + "faces-info"}
              className="flex flex-col gap-8 text-center text-lg text-purple-800 justify-center items-center"
            >
              <h3 className="font-lora capitalize text-2xl text-purple-800">
                {key}
              </h3>
              <p className="font-lato text-xl leading-loose tracking-widest">
                {value}
              </p>
            </li>
          ))}
          <li className="sm:col-span-2 md:col-span-3 xl:col-span-5 w-full justify-center items-center flex mt-10 mb-20 text-xl">
            {" "}
            <Link
              className=" text-sky-600 text-center hover:text-sky-500 flex gap-1 sm:gap-5"
              to="#text-faces"
            >
              <span className="scale-x-[-1]">☝️☝🏻☝🏼</span>Scroll To Menu
              <span>☝🏽☝🏾☝🏿</span>
            </Link>
          </li>
        </ul>
        <CopyPaste
          isHidden={textareaIsHidden}
          setIsHidden={setTextareaIsHidden}
          displayCopyText={displayCopyText}
          setDisplayCopyText={setDisplayCopyText}
        />
      </main>
    </div>
  );
}
