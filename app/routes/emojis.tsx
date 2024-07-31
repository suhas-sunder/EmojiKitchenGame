import {
  Link,
  MetaFunction,
  Outlet,
  useLocation,
  useMatches,
} from "@remix-run/react";
import Icon from "../client/components/utils/other/Icon";
import { useMemo } from "react";
import { Filename } from "./_index";

export const meta: MetaFunction = () => {
  return [
    { title: "Emoji Meanings 😊" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface RouteData {
  filenames?: Filename[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === "object" && data !== null && "filenames" in data;
}

function Buttons({ filename }: { filename: Filename }) {
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center items-center">
      <li
        title={`Copy ${filename.keys.split("~")[0]} Image`}
        className="flex gap-1 justify-between border-2 px-3 py-2 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400"
      >
        <span>Copy</span>{" "}
        <span className="flex">
          <Icon
            icon="copy"
            title="Copy Paste Icon"
            customStyle="fill-purple-500 w-5"
          />
        </span>
      </li>
      <li
        title={`Like ${filename.keys.split("~")[0]} emoji`}
        className="flex justify-between border-2 gap-1 px-[0.9em] py-2 rounded-md border-rose-300 text-rose-500 cursor-pointer hover:border-rose-200 hover:text-rose-400"
      >
        <span>Like</span>{" "}
        <span className="flex">
          <Icon
            icon="heart"
            title="💖 Heart Icon (like)"
            customStyle="fill-rose-500 w-5"
          />
        </span>
      </li>
      <li
        title={`${filename.keys.split("~")[0]} Emoji meaning`}
        className="col-span-2 mx-auto sm:col-span-1"
      >
        <Link
          to={`/emojis/${
            filename?.id +
            "_✨" +
            filename.keys.split("~")[0] +
            "✨_" +
            filename.keys.split("~")[1].split(" ").join("-") +
            "-emoji"
          }`}
          className="flex justify-between border-2 px-3 gap-1 py-2 rounded-md  border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400"
        >
          {" "}
          <span>View</span>{" "}
          <span className="flex">
            <Icon
              icon="viewPage"
              title="New Tab Icon"
              customStyle="fill-purple-500 w-5"
            />
          </span>
        </Link>
      </li>
    </ul>
  );
}

export default function Emojis() {
  const matches = useMatches();

  // Use type guard to check if the data is of the expected type
  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  const pathname: string =
    useLocation().pathname?.split("/")?.at(-1)?.split("_")[0] || "";

  return (
    <>
      <header className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito">
        <h1 className="capitalize font-lora text-5xl mt-10 text-purple-700 flex justify-center items-center  gap-3">
          {pathname === "emojis"
            ? "All Emojis With Combos"
            : filenames
                ?.filter((filename) => filename.id === pathname)[0]
                ?.keys.split("~")[1] + " Emoji"}{" "}
        </h1>
      </header>
      <main className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito">
        <Outlet />
        <h2 className="text-sky-600 mt-10 hover:text-sky-500">
          <Link to="/emojis">
            Click here to view a list of all copy and paste emojis!
          </Link>
        </h2>
        <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-9 mt-14 w-full max-w-[1200px] px-5">
          {filenames?.map((filename) =>
            filename.id !== pathname ? (
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
                <Buttons filename={filename} />
              </li>
            ) : null
          )}
        </ul>
      </main>
    </>
  );
}
