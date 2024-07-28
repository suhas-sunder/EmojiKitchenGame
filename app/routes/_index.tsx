import type { MetaFunction } from "@remix-run/node";
import localforage from "localforage";

import cloudflareR2API from "../client/api/cloudflareR2API";
import {
  ClientLoaderFunctionArgs,
  json,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async () => {
  let filenames: { name: string; keys: string[] }[] = [];

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
 * @returns {Promise<{ filenames: { name: string, keys: string[] }[] }>} - A promise that resolves to an object containing the filenames.
 * @throws {Error} - If there is an error fetching the filenames from the server or caching them in local storage.
 */
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  // Define the cache key for the filenames
  const cacheKey = "filenames";

  try {
    // If the filenames are not cached, fetch them from the server and cache them
    const { filenames }: { filenames: { name: string; keys: string[] }[] } =
      await serverLoader();

    // Check if the filenames are already cached in local storage
    const cachedFilenames = await localforage.getItem<{
      filenames: { name: string; keys: string[] }[];
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

export default function Index() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    console.log(data.filenames);
  }, [data]);

  return (
    <div className="grid grid-cols-3 justify-center items-center w-full max-w-[1500px] mx-auto">
      <div className="grid grid-cols-10  overflow-y-auto py-6 px-1 h-[50em]">
        {data.filenames.map((filename: { name: string; keys: string[] }) => (
          <div
            key={filename.name}
            className="hover:scale-110 cursor-pointer p-1 border-2 rounded-lg border-transparent hover:border-sky-400"
          >
            <img
              loading="lazy"
              alt={`Emoji of ${filename.keys[0]} ${filename.name}`}
              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                filename.name.length < 9
                  ? filename.name.slice(1)
                  : filename.name.split("-").join("_")
              }/emoji.svg`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-10 overflow-y-auto py-6 px-1  h-[50em]">
        {data.filenames.map((filename: { name: string; keys: string[] }) => (
          <div
            key={filename.name}
            className="hover:scale-110 p-1 border-2 rounded-lg border-transparent opacity-60"
          >
            <img
              loading="lazy"
              alt={`Emoji of ${filename.keys[0]} ${filename.name}`}
              src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                filename.name.length < 9
                  ? filename.name.slice(1)
                  : filename.name.split("-").join("_")
              }/emoji.svg`}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-10 overflow-y-auto py-6 px-1 h-[50em]">
        <Outlet />
      </div>
    </div>
  );
}
