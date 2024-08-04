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
import { Filename } from "./routes/_index";
import pako from "pako";
import ErrorBoundary from "./client/components/utils/errors/ErrorBoundary";

// Server loader to fetch and decompress gzipped JSON data
export const loader = async () => {
  let filenames = [];

  try {
    const response = await cloudflareR2API.get("/emojis/filenames.json.gz", {
      method: "GET",
      responseType: "arraybuffer",
    });

    // Decompress the gzipped response
    const decompressedData = pako.ungzip(new Uint8Array(response.data), { to: "string" });
    filenames = JSON.parse(decompressedData);
  } catch (err) {
    console.error("Failed to fetch and decompress filenames for emoji:", err);
  }

  return json({ filenames }, {
    headers: { "Cache-Control": "max-age=3600, public" }
  });
};

// Function for client-side caching of filenames
export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  const cacheKey = "filenames";

  try {
    const cachedFilenames = await localforage.getItem(cacheKey);

    if (cachedFilenames) {
      return { filenames: cachedFilenames };
    } else {
      const { filenames }: { filenames: Filename[] } = await serverLoader();
      await localforage.setItem(cacheKey, filenames);
      return { filenames };
    }
  } catch (error) {
    console.error("Error fetching cached filenames:", error);
    return { filenames: [] }; // Ensure fallback in case of error
  }
}

// Layout component to define the HTML structure and include layout components
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="pt-14">
        <NavBar />
        <div className="min-h-svh">{children}</div>
        <ScrollRestoration />
        <Scripts />
        <Footer />
      </body>
    </html>
  );
}

// Main App component that provides context to child components
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}
