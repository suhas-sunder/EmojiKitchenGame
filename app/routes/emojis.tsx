import {
  ClientLoaderFunctionArgs,
  json,
  MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import localforage from "localforage";
import cloudflareR2API from "../client/api/cloudflareR2API";

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

  return (
    <div className="flex justify-center items-center">
      <ul className="grid grid-cols-4 gap-6">
        {filenames.map((filename, index) =>
          index <= 12 ? (
            <li
              title={
                filename.keys.split("~")[0] + " " + filename.keys.split("~")[1]
              }
              aria-label={
                filename.keys.split("~")[0] + " " + filename.keys.split("~")[1]
              }
              key={filename?.id}
              className="flex justify-center items-center"
            >
              <img
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
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
