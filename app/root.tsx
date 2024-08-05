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

// Loader function to fetch the data
export const loader = async () => {
  let filenames = [];

  try {
    const response = await cloudflareR2API.get("/emojis/filenames.json", {
      method: "GET",
      responseType: "json",
    });

    filenames = response.data;
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

// Client Loader Function to handle caching
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
    return { filenames: [] };
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

// App Component for managing application state
export default function App() {
  const [copyText, setCopyText] = useState("");
  const [displayCopyText, setDisplayCopyText] = useState("");
  const [textareaIsHidden, setTextareaIsHidden] = useState(false);

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
