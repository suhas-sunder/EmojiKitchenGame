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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import CopyPaste from "../client/components/ui/CopyPasteTextbox";
import SectionMenu from "../client/components/navigation/SectionMenu";
import useManageCopiedMsg from "../client/components/hooks/useManageCopiedMsg";
import useDisplayLimitOnScroll from "../client/components/hooks/useDisplayLimitOnScroll";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Text Faces (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ - Copy and Paste Cute and Creative Text Emoticons!",
    },
    {
      name: "description",
      content:
        "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ Discover and share the cutest and most creative text faces! ಥ_ಥ Easily copy and paste a variety of unique emoticons for all your messages and social media posts. Express yourself with our extensive collection of fun text faces!",
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
    console.error("Error fetching text faces:", error);
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
    console.error("Error fetching faces info:", error);
  }

  if (!textFaces || Object.keys(textFaces).length === 0)
    return redirect("/404");

  return json({ textFaces, facesInfo });
};

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const cacheKey = "textFaces";
  const cacheKey1 = "facesInfo";

  try {
    const textFaces = await localforage.getItem<{ textFaces: TextFaces }>(
      cacheKey
    );
    const facesInfo = await localforage.getItem<{ facesInfo: TextFaces }>(
      cacheKey1
    );

    if (textFaces && facesInfo) {
      return { textFaces, facesInfo };
    } else {
      const {
        textFaces,
        facesInfo,
      }: { textFaces: TextFaces; facesInfo: TextFaces } = await serverLoader();
      await localforage.setItem(cacheKey, textFaces);
      await localforage.setItem(cacheKey1, facesInfo);
      return { textFaces, facesInfo };
    }
  } catch (error) {
    console.error("Error fetching cached data:", error);
  }
}

export default function TextFaces() {
  const {
    textFaces,
    facesInfo,
  }: { textFaces: TextFaces; facesInfo: TextFaces } = useLoaderData();
  const { isCopied, setIsCopied } = useManageCopiedMsg();
  const [displayLimit, setDisplayLimit] = useState<number>(2);
  useDisplayLimitOnScroll({ displayLimit, setDisplayLimit });

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

  const textFacesEntries = useMemo(
    () => Object.entries(textFaces),
    [textFaces]
  );
  const facesInfoEntries = useMemo(
    () => Object.entries(facesInfo),
    [facesInfo]
  );

  return (
    <div className="flex flex-col gap-5 justify-center items-center">
      <header>
        <h1 className="mt-10 font-lora text-center leading-loose text-purple-700 mb-5 text-2xl mx-5 sm:text-3xl">
          Copy and Paste Text Faces{" "}
          <span className="whitespace-nowrap">(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</span>
          <div id="text-faces" className="-translate-y-32"></div>
        </h1>
      </header>
      <main
        onMouseEnter={() => setDisplayLimit(1000)}
        onTouchStart={() => setDisplayLimit(1000)}
        className="flex flex-col max-w-[1200px] gap-20 font-nunito justify-center items-center"
      >
        <SectionMenu object={textFaces} />
        <div className="flex flex-col gap-14">
          {textFacesEntries.map(([key, value], index) => {
            return index < displayLimit ? (
              <div
                key={`${key}-${index}`}
                className="-translate-y-6 flex flex-col overflow-auto lg:overflow-hidden pt-10 sm:px-10 scrollbar-thin xl:border-2 rounded-lg border-slate-100 scrollbar-thumb-rose-700 scrollbar-track-rose-300"
              >
                <h2 className="flex capitalize mb-8 w-full text-rose-400 justify-center items-center text-center text-2xl">
                  {key.split("-").join(" ")} Faces
                </h2>
                <ul className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 text-2xl justify-center items-center">
                  {value.map((face, index) => (
                    <li
                      className="flex sm:whitespace-nowrap justify-center items-center"
                      title={face}
                      key={`${key}-${face}-${index}`}
                    >
                      <button
                        aria-label={`Copy ${face} face to clipboard`}
                        onClick={() => {
                          setIsCopied(face);
                          setCopyText(face);
                        }}
                        className={`hover:text-slate-800 max-w-[13em] sm:max-w-auto flex text-center hover:scale-110 sm:overflow-visible text-slate-600 border-slate-300 hover:border-slate-400 w-full justify-center items-center border-2 sm:px-5 py-4 rounded-md`}
                      >
                        <span className="flex">
                          {isCopied === face.replace(/\s*\n\s*/g, "")
                            ? "✧･ﾟ Copied! ･ﾟ✧"
                            : face.split("  ").join("")}
                        </span>
                      </button>
                      <div id={key} className="-translate-y-44"></div>
                    </li>
                  ))}

                  <li className="sm:col-span-2 md:col-span-3 xl:col-span-5 w-full justify-center items-center flex mt-10 mb-20 text-xl">
                    <Link
                      aria-label="Scroll To Menu"
                      className="text-sky-600 translate-y-8 text-center hover:text-sky-500 flex gap-1 sm:gap-5"
                      to="#text-faces"
                    >
                      <span className="scale-x-[-1]">☝️☝🏻☝🏼</span>Scroll To Menu
                      <span>☝🏽☝🏾☝🏿</span>
                    </Link>
                  </li>
                </ul>
              </div>
            ) : null;
          })}
        </div>
        <ul className="flex gap-10 mb-40 flex-col mx-5">
          {facesInfoEntries.map(([key, value], index) => (
            <li
              key={`${key}-${index}`}
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
            <Link
              className="text-sky-600 text-center hover:text-sky-500 flex gap-1 sm:gap-5"
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
