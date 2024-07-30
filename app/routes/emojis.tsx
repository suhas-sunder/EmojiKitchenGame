import {
  ClientLoaderFunctionArgs,
  json,
  Link,
  MetaFunction,
  Outlet,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import localforage from "localforage";
import cloudflareR2API from "../client/api/cloudflareR2API";
import Icon from "../client/components/utils/other/Icon";
import { useEffect, useState } from "react";
import Paginate from "../client/components/ui/Paginate";

export const meta: MetaFunction = () => {
  return [
    { title: "Emoji Meanings 😊" },
    { name: "description", content: "Welcome to Remix!" },
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

export default function Emojis() {
  const { filenames }: { filenames: { id: string; keys: string }[] } =
    useLoaderData<typeof loader>();
  const [isClient, setIsClient] = useState(false); //App crashes when server side tries to run the react-paginate library so this checks if client side is ready before serving client-side code.

  const itemsPerPage: number = 12;

  const [paginatedItems, setPaginatedItems] = useState<
    { id: string; keys: string }[]
  >(filenames.slice(0, itemsPerPage));

  const pathname: string =
    useLocation().pathname?.split("/")?.at(-1)?.split("_")[0] || "";

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center tracking-wider text-slate-800 font-nunito">
      <Outlet />
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-9 mt-14 w-full max-w-[1200px] px-5">
        {paginatedItems.map((filename) =>
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
              <p className="capitalize  font-lora">
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
      {isClient && (
        <Paginate
          itemsPerPage={itemsPerPage}
          items={filenames}
          setPaginatedItems={(items) =>
            setPaginatedItems(items as { id: string; keys: string }[])
          }
          paginatedItems={paginatedItems}
        />
      )}
    </div>
  );
}
