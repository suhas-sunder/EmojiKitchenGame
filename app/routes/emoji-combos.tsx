import {
  Link,
  MetaFunction,
  Outlet,
  useLocation,
  useMatches,
} from "@remix-run/react";
import Icon from "../client/components/utils/other/Icon";
import { useEffect, useMemo, useState } from "react";
import { Filename } from "./_index";
import useSearch from "../client/components/hooks/useSearch";
import SearchBar from "../client/components/ui/SearchBar";
import HandleDiceRoll from "../client/components/utils/generators/HandleDiceRoll";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "🥘😋 All emojis with combos - emoji kitchen, emoji copy and paste, emoji meanings, emoji combos, and more!",
    },
    {
      name: "description",
      content:
        "Explore the emojipedia of emoji kitchen combinations! Discover endless emoji combos like 🥘😋, copy and paste your favorites, explore detailed emoji meanings, and find unique combinations for every occasion. Perfect for social media, messaging, and creative expression!",
    },
  ];
};

interface RouteData {
  filenames?: Filename[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === "object" && data !== null && "filenames" in data;
}

function Buttons({
  filename,
  setSearchEmoji,
}: {
  filename: Filename;
  setSearchEmoji: (searchEmoji: string) => void;
}) {
  const [isCopied, setIsCopied] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      isCopied && setIsCopied("");
    }, 400);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <ul className="grid grid-cols-4 sm:grid-cols-4 gap-x-4 gap-y-6 justify-center items-center">
      <li
        title={`Like ${filename.keys.split("~")[0]} emoji`}
        className="flex justify-center items-center col-span-2"
      >
        <button className="flex gap-1 justify-between border-2 px-3 py-2 hover:scale-110 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-500 hover:text-purple-600">
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
        title={`${filename.keys.split("~")[0]} Emoji meaning`}
        className="col-span-2 w-full justify-center items-center mx-auto"
      >
        <Link
          to={`/emoji-combos/${
            filename?.id +
            "_✨" +
            filename.keys.split("~")[0] +
            "✨_" +
            filename.keys.split("~")[1].split(" ").join("-") +
            "-emoji"
          }`}
          onClick={() => setTimeout(() => setSearchEmoji(""), 1000)}
          className="flex justify-center sm:justify-between border-2 px-3 gap-1 py-2 hover:scale-110 rounded-md  border-rose-300 text-rose-500 cursor-pointer hover:border-rose-500 hover:text-rose-600"
        >
          {" "}
          <span>View</span>{" "}
          <span className="flex">
            <Icon
              icon="viewPage"
              title="New Tab Icon"
              customStyle="fill-rose-500 w-5 "
            />
          </span>
        </Link>
      </li>
      <li
        className="flex col-span-4 justify-center items-center"
        title={`Copy ${filename.keys.split("~")[0]} Emoji`}
      >
        <button
          onClick={() => {
            setIsCopied(filename?.keys?.split("~")[0]);
            navigator.clipboard.writeText(filename?.keys?.split("~")[0]);
          }}
          className="flex justify-between border-2 px-3 py-2 hover:scale-110 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-500 hover:text-purple-600"
        >
          {isCopied === filename?.keys?.split("~")[0] ? (
            <span className="text-sm py-[0.14em]">Copied!</span>
          ) : (
            <div className="flex gap-1">
              <span>Copy Emoji</span>{" "}
              <span className="flex">{filename.keys.split("~")[0]}</span>
            </div>
          )}
        </button>
      </li>
    </ul>
  );
}

export default function EmojiCombos() {
  const matches = useMatches();

  // Use type guard to check if the data is of the expected type
  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  const { searchEmoji, setSearchEmoji } = useSearch();

  const pathname: string =
    useLocation().pathname?.split("/")?.at(-1)?.split("_")[0] || "";

  return (
    <>
      <header
        id="#emoji-combo-header"
        className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito mx-5"
      >
        <h1 className="capitalize font-lora text-2xl leading-relaxed text-center  md:text-3xl lg:text-4xl mt-10 text-purple-700 flex justify-center items-center  gap-3">
          {pathname === "emoji-combos"
            ? "🥘 All Emojis With Combos 😋"
            : filenames
                ?.filter((filename) => filename.id === pathname)[0]
                ?.keys.split("~")[1] + " Emoji"}{" "}
          {pathname !== "emoji-combos" && (
            <Link
              title={"🔍 Scroll To Search Bar"}
              to={"#search-bar"}
              className="flex text-3xl hover:scale-110"
            >
              🔍
            </Link>
          )}
        </h1>
      </header>
      <main className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito ">
        <Outlet />
        <h2 className="text-sky-600 mt-10 hover:text-sky-500 text-center  mx-5">
          <Link to="/copy-and-paste/emoji-copy-and-paste">
            Click here to view a list of all copy and paste emojis!
          </Link>
        </h2>
        <div className="flex mx-5 w-full justify-center items-center">
          <SearchBar
            uniqueId="combos"
            setSearchEmoji={setSearchEmoji}
            customStyle="mt-11 w-full max-w-[1200px] "
            placeholder="search emojis"
            customLabelStyle="pl-3"
            searchEmoji={searchEmoji}
            handleDiceRoll={() => {
              filenames && setSearchEmoji(HandleDiceRoll({ filenames }));
            }}
          />
        </div>
        <ul className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-2 overflow-y-auto pt-2 rounded-md  mx-5 max-h-[9em] mt-3 bg-purple-50 scrollbar-thumb-purple-500 px-2 scrollbar-track-purple-200 scrollbar-thin">
          {filenames?.map((filename) => (
            <li key={filename?.id + "emoji-search-preview"}>
              <button
                title={
                  filename.keys.split("~")[0] +
                  " " +
                  filename.keys.split("~")[1]
                }
                tabIndex={-1}
                onClick={() => setSearchEmoji(filename.keys.split("~")[0])}
                className="text-2xl w-10 h-10 border-2 rounded-md hover:scale-110 bg-white border-purple-200 hover:border-purple-500 "
              >
                {filename.keys.split("~")[0]}
              </button>
            </li>
          ))}
        </ul>
        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-9 mt-10 md:w-full max-w-[1150px] px-5">
          {filenames?.map((filename) =>
            filename.id !== pathname &&
            (searchEmoji === "" ||
              filename?.keys?.includes(searchEmoji.trim())) ? (
              <li
                key={filename?.id}
                className="flex flex-col gap-5 justify-center items-center border-2 border-purple-200 p-5 rounded-lg w-full min-h-[15em] text-center"
              >
                <h2 className="uppercase font-lora">
                  {filename.keys.split("~")[0]} (U+{filename.id.slice(1)})
                </h2>
                <img
                  loading="lazy"
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
                  width={50}
                  height={50}
                  alt={`Emoji of ${filename?.keys?.split("~")[0]} ${
                    filename?.id
                  }`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    filename?.id?.length < 9
                      ? filename?.id.slice(1)
                      : filename?.id.split("-").join("_")
                  }/emoji.svg`}
                />
                <p className="capitalize font-lora mb-2">
                  {" "}
                  {filename.keys.split("~")[1]}
                </p>
                <Buttons filename={filename} setSearchEmoji={setSearchEmoji} />
              </li>
            ) : null
          )}
        </ul>
        <Link
          to={"#emoji-combo-header"}
          className="font-nunito text-2xl translate-y-24 flex gap-4 justify-center items-center  text-sky-600 hover:text-sky-500"
        >
          <span className="scale-x-[-1]">☝️☝🏻☝🏼</span>Scroll To Top
          <span>☝🏽☝🏾☝🏿</span>
        </Link>
      </main>
    </>
  );
}
