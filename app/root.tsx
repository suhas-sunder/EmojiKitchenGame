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

// Loader function to fetch and decompress the data
export const loader = async () => {
  let filenames: { id: string; keys: string }[] = [];

  try {
    // Fetch the response
    const response = await cloudflareR2API.get("/emojis/filenames.json.gz", {
      method: "GET",
      responseType: "arraybuffer", // Ensure the response is treated as binary data
    });

    // Check for gzip magic number
    const isGzip = response.data[0] === 0x1f && response.data[1] === 0x8b;

    if (isGzip) {
      // Decompress the gzip data
      const decompressedData = pako.ungzip(new Uint8Array(response.data), {
        to: "string",
      });
      filenames = JSON.parse(decompressedData);
    } else {
      // Directly parse the JSON if not compressed
      const textData = new TextDecoder().decode(response.data);
      filenames = JSON.parse(textData);
    }
    
  } catch (err) {
    console.error("Failed to fetch or decompress filenames for emoji!", err);
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

// Client Loader Function to handle caching
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const cacheKey = "filenames";

  try {
    const cachedFilenames = await localforage.getItem<{
      filenames: { id: string; keys: string }[];
    }>(cacheKey);

    if (cachedFilenames) {
      return { filenames: cachedFilenames };
    } else {
      const { filenames }: { filenames: { id: string; keys: string }[] } =
        await serverLoader();

      await localforage.setItem(cacheKey, filenames);
      return { filenames };
    }
  } catch (error) {
    console.error("Error fetching cached filenames:", error);
    return { filenames: [] }; // Return empty array if error occurs
  }
}

// Layout Component for rendering HTML structure
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={`pt-14`}>
        <NavBar />
        <div className="min-h-svh">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

// App Component for managing application state
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
