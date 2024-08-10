import { MetaFunction } from "@remix-run/node";
import { Link, useMatches } from "@remix-run/react";
import { useMemo } from "react";
import { Filename } from "./_index";

export const meta: MetaFunction = () => {
  return [
    { title: "🗺️ Emoji Kitchen Game Sitemap! ✨💀🎉" },
    {
      name: "description",
      content:
        "🗺️⭐ Meta Description: Explore our comprehensive sitemap to navigate through our website effortlessly. Find links to all our main sections, including content pages, features, and resources, to quickly access what you're looking for. 🔍 🔥🍳👩‍🍳 Emoji Kitchen 👀👍🫶🏻✔️🙏🚀🤩",
    },
  ];
};

interface RouteData {
  filenames?: Filename[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === "object" && data !== null && "filenames" in data;
}

export default function Sitemap() {
  const matches = useMatches();

  // Use type guard to check if the data is of the expected type
  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  return (
    <div className="flex justify-center gap-10  leading-loose tracking-widest flex-col items-center mx-10">
      <header>
        <h1 className=" font-lora text-center text-purple-700 translate-y-10 text-2xl mx-5 sm:text-3xl">
          Sitemap
        </h1>
      </header>
      <main className="max-w-[1200px]  my-10 text-sky-600 text-lg flex gap-16 flex-col mb-64 w-full">
        <ol className="flex  flex-col list-decimal font-nunito mr-auto">
          {/* <li>
            <Link to="/about" className="hover: hover:text-sky-400">
              About
            </Link>
          </li> */}
          <li>
            <Link to="/" className=" hover:text-sky-400 pb-4 flex mr-auto">
              Emoji Kitchen Game (Home)
            </Link>
          </li>
          <li>
            <Link
              to="/emoji-combos"
              className=" hover:text-sky-400 pb-4 flex mr-auto"
            >
              Emoji Combos
            </Link>
            <ol className="flex flex-col font-lato capitalize list-decimal pl-10 mr-auto">
              {filenames?.map((filename: Filename) => (
                <li key={filename.id}>
                  <Link
                    to={`/emoji-combos/${filename.id}`}
                    className="hover: hover:text-sky-400 pl-2 pb-5 flex gap-3 mr-auto"
                  >
                    <span className="text-2xl">
                      {filename.keys.split("~")[0]}
                    </span>
                    {" " + filename.keys.split("~")[1]}
                  </Link>
                </li>
              ))}
            </ol>
          </li>
          <li>
            <Link
              to="/copy-and-paste/text-faces"
              className="hover: hover:text-sky-400"
            >
              Text Faces
            </Link>
          </li>
          <li>
            <Link
              to="/copy-and-paste/emoji-copy-and-paste"
              className="hover: hover:text-sky-400"
            >
              Emoji Copy and Paste
            </Link>
          </li>
          <li>
            <Link to="/terms-of-service" className="hover: hover:text-sky-400">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link to="/cookies-policy" className="hover: hover:text-sky-400">
              Cookies Policy
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="hover: hover:text-sky-400">
              Privacy Policy
            </Link>
          </li>
        </ol>
      </main>
    </div>
  );
}
