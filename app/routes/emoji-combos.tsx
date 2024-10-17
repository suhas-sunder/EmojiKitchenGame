import {
  Link,
  MetaFunction,
  Outlet,
  useLoaderData,
  useLocation,
  useMatches,
} from "@remix-run/react";
import Icon from "../client/components/utils/other/Icon";
import { useEffect, useMemo, useState } from "react";
import { Filename } from "./_index";
import useSearch from "../client/components/hooks/useSearch";
import SearchBar from "../client/components/ui/SearchBar";
import HandleDiceRoll from "../client/components/utils/generators/HandleDiceRoll";
import useWindowWidth from "../client/components/hooks/useWindowWidth";
import useBodyEventListeners from "../client/components/hooks/useBodyEventListeners";
import trackingAPI from "../client/components/api/trackingAPI";
import { json, LoaderFunction } from "@remix-run/node";
import useUpdateLikes from "../client/components/hooks/useUpdateLikes";
import LikesAndViews from "../client/components/ui/LikesAndViews";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "✨ All emojis with combos 🟰 emoji kitchen, emoji copy and paste, emoji meanings, emoji combos, and more! 🥘😋 💀🎉",
    },
    {
      name: "description",
      content:
        "⭐ Explore the emojipedia of emoji kitchen combinations! Discover endless emoji combos like 🥘😋, copy and paste your favorites, explore detailed emoji meanings, and find unique combinations for every occasion. Perfect for social media, messaging, and creative expression! 🔥🍳👩‍🍳 Emoji Kitchen 👀👍🫶🏻✔️🙏🚀🤩",
    },
  ];
};

export const loader: LoaderFunction = async () => {
  // Check if we're in development mode
  if (process.env.NODE_ENV === "development") return json({ totals: [] });

  try {
    // Fetch all totals from the /totals endpoint
    const { data } = await trackingAPI.get("/totals");

    // Return the data to the component
    return json({ totals: data });
  } catch (err) {
    let message: string;

    if (err instanceof Error) {
      message = err.message;
    } else {
      message = String(err);
    }

    // Log the error for debugging
    console.error("Error fetching totals:", message);

    // Return an error response
    return json({ totals: [] });
  }
};

interface RouteData {
  filenames?: Filename[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === "object" && data !== null && "filenames" in data;
}

export type TotalsType = {
  emoji_unicode: string;
  total_views: number;
  total_likes: number;
};

function Buttons({
  filename,
  setSearchEmoji,
  setTotalStats,
  totalStats,
}: {
  filename: Filename;
  setSearchEmoji: (searchEmoji: string) => void;
  totalStats: TotalsType[];
  setTotalStats: React.Dispatch<React.SetStateAction<TotalsType[]>>;
}) {
  const [isCopied, setIsCopied] = useState<string>("");
  const { totals }: { totals: TotalsType[] } = useLoaderData();

  useEffect(() => {
    if (totals.length > 0 && totalStats.length === 0) {
      setTotalStats(totals);
    }
  }, [setTotalStats, totalStats.length, totals]);

  const { updateLikeCount } = useUpdateLikes({ setTotalStats });

  useEffect(() => {
    const timeout = setTimeout(() => {
      isCopied && setIsCopied("");
    }, 400);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  const emoji = filename.keys.split("~")[0];

  return (
    <ul className="grid grid-cols-4 gap-x-10 w-full gap-y-6">
      <li
        title={`Like ${emoji} emoji`}
        className="flex justify-center items-center col-span-2"
      >
        <button
          onClick={() => updateLikeCount(filename.id)}
          className="flex gap-2 ml-auto col-span-2 justify-center border-2 px-3 py-2 hover:scale-105 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-500 hover:text-purple-600"
        >
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
        title={`${emoji} Emoji meaning`}
        className="col-span-2 gap-4 mr-auto justify-center flex items-center"
      >
        <Link
          to={`/emoji-combos/${
            filename.id +
            "_✨" +
            emoji +
            "✨_" +
            filename.keys.split("~")[1].split(" ").join("-") +
            "-emoji"
          }`}
          onClick={() => setTimeout(() => setSearchEmoji(""), 1000)}
          className="flex justify-center sm:justify-between border-2 px-3 gap-1 py-2 hover:scale-105 rounded-md border-rose-300 text-rose-500 cursor-pointer hover:border-rose-500 hover:text-rose-600"
        >
          <span>View</span>{" "}
          <span className="flex">
            <Icon
              icon="viewPage"
              title="New Tab Icon"
              customStyle="fill-rose-500 w-5"
            />
          </span>
        </Link>
      </li>
      <li
        className="flex col-span-4 justify-center items-center"
        title={`Copy ${emoji} Emoji`}
      >
        <button
          onClick={() => {
            setIsCopied(emoji);
            navigator.clipboard.writeText(emoji);
          }}
          className="flex justify-center items-center border-2 px-3 py-2 w-40 hover:scale-105 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-500 hover:text-purple-600"
        >
          {isCopied === emoji ? (
            <span className="text-sm py-[0.14em]">Copied!</span>
          ) : (
            <div className="flex gap-1">
              <span>Copy Emoji</span> <span className="flex">{emoji}</span>
            </div>
          )}
        </button>
      </li>
    </ul>
  );
}

export default function EmojiCombos() {
  const matches = useMatches();
  const windowWidth = useWindowWidth();
  const [displayLimit, setDisplayLimit] = useState<number>(18);
  const [searchDisplayLimit, setSearchDisplayLimit] = useState<number>(73); // Default to 73
  const [totalStats, setTotalStats] = useState<TotalsType[]>([]);
  const [loadCombos, setLoadCombos] = useState<boolean>(false);
  useBodyEventListeners({ setDisplayLimit: setSearchDisplayLimit });

  useEffect(() => {
    if (windowWidth !== undefined) {
      setSearchDisplayLimit(windowWidth < 1022 ? 49 : 73);
    }
  }, [windowWidth]); // Run effect when windowWidth changes

  useEffect(() => {
    const handleScroll = () => {
      if (displayLimit < 1000) {
        setDisplayLimit(1000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [displayLimit]);

  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  const { searchEmoji, setSearchEmoji } = useSearch();

  const pathname =
    useLocation().pathname?.split("/")?.at(-1)?.split("_")[0] || "";

  const filteredFilenames = useMemo(() => {
    if (!filenames) return [];
    return filenames.filter(
      (filename) =>
        filename.id !== pathname &&
        (searchEmoji === "" || filename.keys.includes(searchEmoji.trim()))
    );
  }, [filenames, searchEmoji, pathname]);

  return (
    <>
      <header
        id="#emoji-combo-header"
        className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito mx-5"
      >
        <h1 className="capitalize font-lora text-2xl leading-relaxed text-center md:text-3xl lg:text-4xl mt-10 text-purple-700 flex justify-center items-center gap-3">
          {pathname === "emoji-combos"
            ? "🥘 All Emojis With Combos 😋"
            : filenames
                ?.find((filename) => filename.id === pathname)
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
      <main
        onMouseEnter={() => {
          setDisplayLimit(1000);
          setLoadCombos(true);
        }}
        onTouchStart={() => {
          setDisplayLimit(1000);
          setLoadCombos(true);
        }}
        className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito"
      >
        <Outlet context={{ totalStats, setTotalStats, loadCombos }} />
        <h2 className="text-sky-600 mt-10 hover:text-sky-500 text-center mx-5">
          <Link to="/copy-and-paste/emoji-copy-and-paste">
            Click here to view a list of all copy and paste emojis!
          </Link>
        </h2>
        <div className="flex mx-5 w-full justify-center items-center">
          <SearchBar
            uniqueId="combos"
            setSearchEmoji={setSearchEmoji}
            customStyle="mt-11 w-full max-w-[1200px]"
            customSearchEmojiStyle="-translate-x-[0.38em]"
            placeholder="search emojis"
            customLabelStyle="pl-3"
            searchEmoji={searchEmoji}
            handleDiceRoll={() => {
              filenames && setSearchEmoji(HandleDiceRoll({ filenames }));
            }}
          />
        </div>
        <ul className="grid grid-cols-6 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 xl:grid-cols-24 gap-2 overflow-y-auto pt-2 rounded-md mx-5 max-h-[9em] mt-3 bg-purple-50 scrollbar-thumb-purple-500 px-2 scrollbar-track-purple-200 scrollbar-thin">
          {filenames?.map((filename, index) => {
            return index < searchDisplayLimit ? (
              <li key={filename.id + "emoji-search-preview"}>
                <button
                  title={`${filename.keys.split("~")[0]} ${
                    filename.keys.split("~")[1]
                  }`}
                  tabIndex={-1}
                  onClick={() => setSearchEmoji(filename.keys.split("~")[0])}
                  className="text-2xl w-10 h-10 border-2 rounded-md hover:scale-110 bg-white border-purple-200 hover:border-purple-500"
                >
                  {filename.keys.split("~")[0]}
                </button>
              </li>
            ) : null;
          })}
        </ul>
        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-9 mt-10 md:w-full max-w-[1150px] px-5">
          {filteredFilenames.map((filename, index) => {
            return index < displayLimit ? (
              <li
                key={filename.id}
                className="flex flex-col gap-2 justify-center items-center border-2 border-purple-300 p-5 rounded-lg w-full min-h-[15em] text-center"
              >
                <LikesAndViews unicode={filename.id} totalStats={totalStats} />
                <h2 className="uppercase font-lora">
                  {filename.keys.split("~")[0]} (U+{filename.id.slice(1)})
                </h2>
                <img
                  loading="lazy"
                  title={`${filename.keys.split("~")[0]} ${
                    filename.keys.split("~")[1]
                  }`}
                  width={50}
                  height={50}
                  alt={`Emoji of ${filename.keys.split("~")[0]} ${filename.id}`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    filename.id.length < 9
                      ? filename.id.slice(1)
                      : filename.id.split("-").join("_")
                  }/emoji.svg`}
                />
                <p className="capitalize font-lora mb-2">
                  {filename.keys.split("~")[1]}
                </p>
                <Buttons
                  totalStats={totalStats}
                  setTotalStats={setTotalStats}
                  filename={filename}
                  setSearchEmoji={setSearchEmoji}
                />
              </li>
            ) : null;
          })}
        </ul>
        <Link
          to={"#emoji-combo-header"}
          className="font-nunito text-2xl translate-y-24 flex gap-4 justify-center items-center text-sky-600 hover:text-sky-500"
        >
          <span className="scale-x-[-1]">☝️☝🏻☝🏼</span>Scroll To Top
          <span>☝🏽☝🏾☝🏿</span>
        </Link>
      </main>
    </>
  );
}
