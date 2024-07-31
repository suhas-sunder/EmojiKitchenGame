import {
  Link,
  MetaFunction,
  Outlet,
  useLocation,
  useMatches,
  useNavigate,
} from "@remix-run/react";
import Icon from "../client/components/utils/other/Icon";
import { useEffect, useMemo } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Emoji Meanings 😊" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface RouteData {
  filenames?: { id: string; keys: string }[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === "object" && data !== null && "filenames" in data;
}

export default function Emojis() {
  const matches = useMatches();

  // Use type guard to check if the data is of the expected type
  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  const navigate = useNavigate();

  const pathname: string =
    useLocation().pathname?.split("/")?.at(-1)?.split("_")[0] || "";

  useEffect(() => {
    if (
      filenames?.filter((filename) => filename.id === pathname.split("~")[0])
        .length === 0
    )
      console.log("Display error for invalid emoji!");
  }, [filenames, navigate, pathname]);

  return (
    <div className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito">
      <h1 className="capitalize font-lora text-5xl mt-10 text-slate-600">
        {pathname === "emojis"
          ? "All Emojis"
          : filenames
              ?.filter((filename) => filename.id === pathname)[0]
              ?.keys.split("~")[1] + " Emoji"}
      </h1>
      <Outlet />
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-9 mt-14 w-full max-w-[1200px] px-5">
        {filenames?.map((filename) =>
          filename.id !== pathname ? (
            <li
              key={filename?.id}
              className="flex flex-col gap-5 justify-center items-center border-2 border-purple-300 p-5 rounded-lg w-full min-h-[15em] text-center"
            >
              <h2 className="uppercase font-lora">
                {filename.keys.split("~")[0]} ~ (U+{filename.id.slice(1)})
              </h2>
              <img
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
              <p className="capitalize font-lora">
                {" "}
                {filename.keys.split("~")[1]}
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center items-center">
                <li className="flex gap-2 justify-between border-2 px-3 py-2 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400">
                  <span>Copy</span>{" "}
                  <span>
                    <Icon icon="copy" />
                  </span>
                </li>
                <li className="flex justify-between border-2 px-[0.9em] py-2 rounded-md border-rose-300 text-rose-500 cursor-pointer hover:border-rose-200 hover:text-rose-400">
                  <span>Like</span>{" "}
                  <span>
                    <Icon icon="heart" customStyle="pr-[0.2em]" />
                  </span>
                </li>
                <li className="col-span-2 mx-auto sm:col-span-1 ">
                  <Link
                    to={`/emojis/${
                      filename?.id +
                      "_✨" +
                      filename.keys.split("~")[0] +
                      "✨_" +
                      filename.keys.split("~")[1].split(" ").join("-") +
                      "-emoji"
                    }`}
                    className="flex justify-between border-2 px-3 py-2 rounded-md  border-purple-300 text-purple-500 cursor-pointer hover:border-purple-200 hover:text-purple-400"
                  >
                    {" "}
                    <span>View</span>{" "}
                    <span>
                      <Icon icon="viewPage" />
                    </span>
                  </Link>
                </li>
              </ul>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
