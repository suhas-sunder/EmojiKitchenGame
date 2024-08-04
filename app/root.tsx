import "./tailwind.css";
import NavBar from "./client/components/navigation/NavBar";
import Footer from "./client/components/navigation/Footer";

import {
  ClientLoaderFunctionArgs,
  json,
  Outlet,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import localforage from "localforage";
import cloudflareR2API from "./client/components/api/cloudflareR2API";
import { useEffect, useState } from "react";
import pako from "pako";

export const loader = async () => {
  let filenames: { id: string; keys: string }[] = [];

  try {
    // Fetch the response with Axios
    const response = await cloudflareR2API.get("/emojis/filenames.json.gz", {
      method: "GET",
      headers: {
        "Accept-Encoding": "gzip",
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer", // Ensure the response is treated as binary data
    });

    // Access headers safely using bracket notation
    const contentEncoding = response.headers["content-encoding"] || "";

    if (contentEncoding.includes("gzip")) {
      // Decompress the gzip data
      const decompressedData = pako.ungzip(new Uint8Array(response.data), {
        to: "string",
      });
      filenames = JSON.parse(decompressedData);
    } else {
      // Directly parse the JSON if not compressed
      filenames = JSON.parse(new TextDecoder().decode(response.data));
    }
  } catch (err) {
    console.error("Failed to fetch filenames for emoji!", err);
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
    // Check if the filenames are already cached in local storage
    const cachedFilenames = await localforage.getItem<{
      filenames: { id: string; keys: string }[];
    }>(cacheKey);

    // If the filenames are cached, return them
    if (cachedFilenames) {
      return { filenames: cachedFilenames };
    } else {
      // If the filenames are not cached, fetch them from the server and cache them
      const { filenames }: { filenames: { id: string; keys: string }[] } =
        await serverLoader();

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={` pt-14`}>
        <NavBar />
        <div className="min-h-svh">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

export default function App() {
  const [copyText, setCopyText] = useState<string>("");
  const [displayCopyText, setDisplayCopyText] = useState<string>("");
  const [textareaIsHidden, setTextareaIsHidden] = useState<boolean>(false);

  useEffect(() => {
    if (copyText) {
      navigator.clipboard.writeText(copyText.replace(/\s*\n\s*/g, ""));
      setDisplayCopyText(
        displayCopyText + " " + copyText.replace(/\s*\n\s*/g, "")
      );
      setCopyText("");
    }
  }, [copyText, displayCopyText]);

  return (
    <Outlet
      context={{
        copyText,
        setCopyText,
        displayCopyText,
        setDisplayCopyText,
        textareaIsHidden,
        setTextareaIsHidden,
      }}
    />
  );
}
