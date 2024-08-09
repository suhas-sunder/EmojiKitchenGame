import "./tailwind.css";
import NavBar from "./client/components/navigation/NavBar";
import Footer from "./client/components/navigation/Footer";
import ReactGA from "react-ga4";

import {
  ClientLoaderFunctionArgs,
  json,
  Outlet,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import localforage from "localforage";
import cloudflareR2API from "./client/components/api/cloudflareR2API";
import { useEffect, useState } from "react";
import pako from "pako";
import { Filename } from "./routes/_index";

// Loader function to fetch and decompress the data
export const loader = async () => {
  let filenames = [];

  try {
    const response = await cloudflareR2API.get("/emojis/filenames.json.gz", {
      method: "GET",
      responseType: "arraybuffer",
    });

    const isGzip = response.data[0] === 0x1f && response.data[1] === 0x8b;

    if (isGzip) {
      const decompressedData = pako.ungzip(new Uint8Array(response.data), {
        to: "string",
      });
      filenames = JSON.parse(decompressedData);
    } else {
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
    const cachedFilenames = await localforage.getItem(cacheKey);

    if (cachedFilenames) {
      return { filenames: cachedFilenames };
    } else {
      const { filenames }: { filenames: Filename[] } = await serverLoader();
      await localforage.setItem(cacheKey, filenames);

      //Cache each emoji image from the server
      const fetchAndStoreImage = async (url: string) => {
        // Check if the URL is valid and if the image blob is already in the state
        if (!url) {
          return;
        }

        try {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(
              `Failed to fetch image from URL: ${url}, Status: ${response.status}`
            );
            return;
          }
          const blob = await response.blob();
          if (blob) {
            await localforage.setItem(url, blob);
          } else {
            console.error(`No blob received for URL: ${url}`);
          }
        } catch (error) {
          console.error(`Error fetching image from URL: ${url}`, error);
        }
      };

      filenames.forEach((filename) => {
        fetchAndStoreImage(
          `https://www.honeycombartist.com/emojis/base/${filename.id.slice(
            1
          )}.png`
        );
      });

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
  const [stopGADelayOnStart, setStopGADelayOnStart] = useState(false);
  const pathname = useLocation().pathname;
  
  useEffect(() => {
    const loadGoogleAnalyticsAdsense = async () => {
      await ReactGA.initialize("G-MZ3BW959JC"); // Initialize Google Analytics

      // Send page view with a custom path
      ReactGA.send({
        hitType: "pageview",
        page: pathname,
        title: "Custom Title",
      });
    };

    const delay = stopGADelayOnStart ? 0 : 4000;

    setStopGADelayOnStart(true);

    const timer = setTimeout(loadGoogleAnalyticsAdsense, delay);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (copyText) {
      // Clean the text by removing any line breaks or unnecessary spaces
      const cleanedText = copyText.replace(/\s*\n\s*/g, "");

      // Copy the cleaned text to the clipboard
      navigator.clipboard
        .writeText(cleanedText)
        .then(() => {
          // Update the display text
          setDisplayCopyText(
            (prevDisplayCopyText) => `${prevDisplayCopyText} ${cleanedText}`
          );
          // Clear the copyText state
          setCopyText("");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  }, [copyText]);

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
