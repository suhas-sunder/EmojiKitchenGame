import {
  ClientLoaderFunctionArgs,
  json,
  Link,
  MetaFunction,
  redirect,
  useLoaderData,
} from "@remix-run/react";
import localforage from "localforage";
import cloudflareR2API from "../client/components/api/cloudflareR2API";
import { v4 as uuidv4 } from "uuid";
import { Fragment } from "react/jsx-runtime";
import Icon from "../client/components/utils/other/Icon";
import ComboImage from "../client/components/layout/ComboImage";
import { EmojiDataType } from "./_index";
import { useEffect, useState } from "react";

export const meta: MetaFunction = ({ data }) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { emojiData }: EmojiDataType = data;

  if (!emojiData)
    return [
      { title: "🎉 Copy, Paste, & Share Fun Emojis & Symbols! ✨" },
      {
        name: "description",
        content:
          "😎🚀 Explore our collection of vibrant emojis and unique symbols ready for you to copy, paste, and share! Whether you're adding flair to your messages or expressing emotions with ease, you'll find the perfect emoji or symbol here. 🌟✨ Dive in and let your creativity shine!",
      },
    ];

  return [
    {
      title: `${emojiData.title} - Emoji Meaning: ${emojiData.name} - ${emojiData.unicode} `,
    },
    { name: "description", content: `${emojiData?.description}` },
  ];
};

export const loader = async ({ params }: ClientLoaderFunctionArgs) => {
  if (!params.emoji) return redirect("/404");

  const unicode = params?.emoji?.split("_")[0];

  let emojiData = null;

  try {
    const response = await cloudflareR2API
      .get(`/emojis/${unicode.length < 9 ? unicode.slice(1) : unicode}.json`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data);

    if (response) {
      emojiData = response;
    }
  } catch (error) {
    // If there is an error fetching the emoji filenames, log the error
    console.error("Error fetching emoji filenames:", error);
  }

  if (!emojiData) return redirect("/404");

  return json({ emojiData });
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
export async function clientLoader({
  serverLoader,
  params,
}: ClientLoaderFunctionArgs) {
  // Define the cache key for the emoji data file
  if (!params.emoji) return redirect("/404");

  const cacheKey = params?.emoji?.split("_")[0];

  try {
    // Check if the emojiData are already cached in local storage
    const cachedFilenames = await localforage.getItem<{
      emojiData: EmojiDataType[];
    }>(cacheKey);

    // If the emojiData are cached, return them
    if (cachedFilenames) {
      return { emojiData: cachedFilenames };
    } else {
      // If the filenames are not cached, fetch them from the server and cache them
      const { emojiData }: { emojiData: EmojiDataType[] } =
        await serverLoader();

      // Cache the emojiData in local storage
      await localforage.setItem(cacheKey, emojiData);

      // Return the cached emojiData
      return { emojiData };
    }
  } catch (error) {
    // If there is an error fetching the cached filenames, log the error and continue to fetch the filenames from the server
    console.error("Error fetching cached filenames:", error);
  }
}

function EmojiPreview({ emoji }: { emoji: EmojiDataType }) {
  const [isCopied, setIsCopied] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      isCopied && setIsCopied("");
    }, 400);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return (
    <div className="max-w-[1200px] mx-5 flex sm:block flex-col sm:flex-row gap-12 sm:gap-0 text-center justify-center items-center sm:text-left">
      <div className="float-left border-2 bg-purple-50 min-w-[16em] border-purple-200 pb-12 pt-6 -translate-y-2  px-10 sm:mr-8  flex flex-col rounded-lg ">
        <h2 className="tracking-widest leading-relaxed uppercase font-lora flex justify-center items-center gap-2">
          <span className="text-2xl">{emoji.title}</span>(U+
          {emoji.unicode.slice(1)})
        </h2>
        <div className="flex flex-col  justify-center mt-5 items-center gap-3">
          <img
            loading="lazy"
            title={emoji?.title + " " + emoji?.unicode}
            aria-label={emoji?.title + " " + emoji?.unicode}
            width={50}
            height={50}
            alt={`Emoji of ${emoji.title + " " + emoji.unicode}`}
            src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
              emoji?.unicode?.length < 9
                ? emoji?.unicode.slice(1)
                : emoji?.unicode.split("-").join("_")
            }/emoji.svg`}
          />
          <ul className="grid grid-cols-2 mt-5 gap-x-12 gap-y-6 text-lg font-nunito justify-center items-center">
            <li
              title={`Like ${emoji?.title} emoji`}
              className="flex justify-center items-center col-span-2"
            >
              <button className="flex gap-1 bg-white justify-between border-2 px-3 py-2 hover:scale-105 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-500 hover:text-purple-600">
                <span>Like</span>{" "}
                <span className="flex">
                  <Icon
                    icon="heart"
                    title="💖 Heart Icon (like)"
                    customStyle="fill-rose-500 w-5 translate-y-[0.1rem]"
                  />
                </span>
              </button>
            </li>
            <li
              className="flex col-span-2 justify-center items-center"
              title={`Copy ${emoji?.title} Emoji`}
            >
              <button
                onClick={() => {
                  setIsCopied(emoji?.title);
                  navigator.clipboard.writeText(emoji?.title);
                }}
                className="flex bg-white w-40 justify-center items-center border-2 px-3 py-2 hover:scale-105 rounded-md border-purple-300 text-purple-500 cursor-pointer hover:border-purple-500 hover:text-purple-600"
              >
                {isCopied === emoji?.title ? (
                  <span className="text-lg min-w-[4.9em] flex text-center justify-center items-center">
                    {" "}
                    Copied!
                  </span>
                ) : (
                  <div className="flex gap-1 px-2 justify-center items-center">
                    <span className="whitespace-nowrap text-base">
                      Copy Emoji
                    </span>{" "}
                    <span className="flex">{emoji?.title}</span>
                  </div>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <p>{emoji.description}</p>
    </div>
  );
}

function ComboTable({ emoji }: { emoji: EmojiDataType }) {
  return (
    <table className="flex flex-col w-full sm:gap-8 text-center items-center max-h-[40em] overflow-auto scrollbar-thin scrollbar-thumb-rose-700 scrollbar-track-rose-300">
      <thead className="flex w-full mb-10 sm:mb-none">
        <tr className="gap-2 sm:gap-10 grid grid-cols-8 text-lg text-center sm:text-xl underline decoration-[#fda4af] underline-offset-3 w-full justify-center items-center">
          <th className="text-rose-500 col-span-2 font-nunito flex justify-center items-center w-full">
            First Emoji
          </th>
          <td className="col-span-1"></td>
          <th className="text-rose-500 col-span-2 font-nunito flex justify-center items-center w-full">
            Second Emoji
          </th>
          <td className="col-span-1"></td>
          <th className="text-rose-500 col-span-2 font-nunito flex justify-center items-center w-full">
            Combo
          </th>
        </tr>
      </thead>
      <tbody className="flex gap-6 flex-col w-full">
        {emoji?.combos?.map(
          (combo: { code: string; baseUnicode: string; unicode: string }) => (
            <tr
              key={uuidv4()}
              className="grid w-full gap-2 sm:gap-10 grid-cols-8 justify-center items-center"
            >
              <td className="flex col-span-2 justify-center items-center w-full text-lg font-nunito text-rose-500  py-1 px-1 rounded-lg text-center capitalize">
                <img
                  loading="lazy"
                  className="flex w-12"
                  alt={`Emoji of ${emoji.title} ${emoji.name}`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    emoji.unicode?.length < 9
                      ? emoji.unicode.slice(1)
                      : emoji.unicode.split("-").join("_")
                  }/emoji.svg`}
                />
              </td>
              <td className="col-span-1 text-4xl text-rose-200">+</td>
              <td className="flex justify-center col-span-2 items-center w-full text-lg font-nunito text-rose-500  py-1 px-1 rounded-lg text-center capitalize">
                <img
                  loading="lazy"
                  className="flex w-12"
                  alt={`Emoji of ${emoji.title} ${emoji.name}`}
                  src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${
                    combo.unicode.split("_")[1].split("-")[0] === emoji.unicode
                      ? combo.unicode.split("_")[0].slice(1).split("-")[0]
                      : combo.unicode.split("_")[1].slice(1).split("-")[0]
                  }/emoji.svg`}
                />
              </td>
              <td className="col-span-1 text-4xl text-rose-200">=</td>
              <td className="flex justify-center col-span-2 items-center w-full text-lg font-nunito text-rose-500  py-1 px-1 rounded-lg text-center capitalize">
                <div className="w-12">
                  <ComboImage
                    firstEmoji={
                      combo.baseUnicode.length < 9
                        ? combo.baseUnicode
                        : combo.baseUnicode.split("u").join("")
                    }
                    secondEmoji={combo.unicode.slice(1).split("-u").join("-")}
                    emojiData={emoji}
                    setSecondEmoji={() => {}}
                    menuStyle="hidden"
                    bottomMenuStyle="hidden"
                  />
                </div>
              </td>
              <td className="w-full col-span-4 col-start-3 border-b-2 border-rose-100 mb-3"></td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

function EmojiDetails({ emoji }: { emoji: EmojiDataType }) {
  return (
    <div className="max-w-[1200px] my-10 flex gap-10 flex-col  text-lg leading-loose tracking-widest bg-white bg-opacity-[0.8] p-16 rounded-lg">
      <h2 className="tracking-widest leading-relaxed  font-lora capitalize text-2xl text-center">
        Learn the meaning of {emoji.title} emoji{" "}
        <span className="text-rose-500">(Includes synonyms)</span>
      </h2>
      <ul className="flex gap-5 flex-col">
        {" "}
        {emoji?.meanings?.map((meaning: string) => (
          <li key={uuidv4()}>
            <span className="text-rose-500 font-nunito">
              {meaning?.split(":")[0]}:{" "}
            </span>
            <span>{meaning?.split(":")[1]}</span>
          </li>
        ))}
      </ul>
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-2xl mt-5 text-center">
        How to use {emoji.title} emoji{" "}
        <span className="text-rose-500">in a sentence</span>
      </h2>
      <ul className="flex flex-col gap-5 text-center">
        {" "}
        {emoji?.sentences?.map((sentences: string) => (
          <li key={uuidv4()}>{sentences}</li>
        ))}
      </ul>
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-2xl mt-5 text-center">
        <span className="text-rose-500">Fun Short Story</span> using{" "}
        {emoji.title} emoji
      </h2>
      <ul className="flex flex-col gap-5 text-center">
        {emoji?.story.split("/n").map((paragraph: string) => (
          <li key={uuidv4()}>
            <p>{paragraph}</p>
          </li>
        ))}
      </ul>
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-2xl mt-3 text-center">
        <span className="text-rose-500">
          Related Emoji Keyboard Combinations
        </span>{" "}
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        From Gboard's Emoji Kitchen on Android
      </h2>
      <Link
        className="text-sky-600 hover:text-sky-500 w-full justify-center text-center items-center flex font-nunito mb-1"
        to="/"
      >
        Looking for a specific combination? Click here to search!
      </Link>
      <ComboTable emoji={emoji} />
      <div className="w-full border-b-2 border-rose-100 mt-2"></div>
      <h2 className="tracking-widest leading-relaxed font-lora capitalize text-2xl mt-3 text-center">
        <span className="text-rose-500">Related Keywords</span> to understand
        the emoji meanings of {emoji.title}
      </h2>
      <ul className="grid sm:grid-cols-3 overflow-auto max-h-[40em] scrollbar-thin scrollbar-thumb-rose-700 scrollbar-track-rose-300 sm:max-h-none gap-4 justify-center items-center">
        {" "}
        {emoji?.keywords?.map((keywords: string) => (
          <li
            key={uuidv4()}
            className="flex justify-center items-center text-lg font-nunito text-rose-500  py-1 px-1 rounded-lg text-center capitalize"
          >
            {keywords}
          </li>
        ))}
      </ul>
    </div>
  );
}
interface Languages {
  [key: string]: string;
}

function LanguageTable({ emoji }: { emoji: EmojiDataType }) {
  const languages: Languages = {
    afghanistan: "pashto",
    albania: "albanian",
    algeria: "arabic",
    andorra: "catalan",
    angola: "portuguese",
    argentina: "spanish",
    armenia: "armenian",
    australia: "english",
    austria: "german",
    azerbaijan: "azerbaijani",
    bahamas: "english",
    bahrain: "arabic",
    bangladesh: "bengali",
    barbados: "english",
    belarus: "belarusian",
    belgium: "dutch",
    belize: "english",
    benin: "french",
    bhutan: "dzongkha",
    bolivia: "spanish",
    "bosnia and herzegovina": "bosnian",
    botswana: "english",
    brazil: "portuguese",
    brunei: "malay",
    bulgaria: "bulgarian",
    "burkina faso": "french",
    burundi: "kirundi",
    "cabo verde": "portuguese",
    cambodia: "khmer",
    cameroon: "french",
    canada: "english",
    "central african republic": "french",
    chad: "french",
    chile: "spanish",
    china: "mandarin",
    colombia: "spanish",
    comoros: "french",
    "congo (congo-brazzaville)": "french",
    "costa rica": "spanish",
    croatia: "croatian",
    cuba: "spanish",
    cyprus: "greek",
    "czech republic (czechia)": "czech",
    denmark: "danish",
    djibouti: "french",
    dominica: "english",
    "dominican republic": "spanish",
    ecuador: "spanish",
    egypt: "arabic",
    "el salvador": "spanish",
    "equatorial guinea": "spanish",
    eritrea: "tigrinya",
    estonia: "estonian",
    "eswatini (formerly swaziland)": "swati",
    ethiopia: "amharic",
    fiji: "english",
    finland: "finnish",
    france: "french",
    gabon: "french",
    gambia: "english",
    georgia: "georgian",
    germany: "german",
    ghana: "english",
    greece: "greek",
    grenada: "english",
    guatemala: "spanish",
    guinea: "french",
    "guinea-bissau": "portuguese",
    guyana: "english",
    haiti: "haitian creole",
    honduras: "spanish",
    hungary: "hungarian",
    iceland: "icelandic",
    india: "hindi",
    indonesia: "indonesian",
    iran: "persian",
    iraq: "arabic",
    ireland: "english",
    israel: "hebrew",
    italy: "italian",
    jamaica: "english",
    japan: "japanese",
    jordan: "arabic",
    kazakhstan: "kazakh",
    kenya: "swahili",
    kiribati: "english",
    kuwait: "arabic",
    kyrgyzstan: "kyrgyz",
    laos: "lao",
    latvia: "latvian",
    lebanon: "arabic",
    lesotho: "sesotho",
    liberia: "english",
    libya: "arabic",
    liechtenstein: "german",
    lithuania: "lithuanian",
    luxembourg: "luxembourgish",
    madagascar: "malagasy",
    malawi: "english",
    malaysia: "malay",
    maldives: "dhivehi",
    mali: "french",
    malta: "maltese",
    "marshall islands": "marshallese",
    mauritania: "arabic",
    mauritius: "english",
    mexico: "spanish",
    micronesia: "english",
    moldova: "romanian",
    monaco: "french",
    mongolia: "mongolian",
    montenegro: "montenegrin",
    morocco: "arabic",
    mozambique: "portuguese",
    "myanmar (formerly burma)": "burmese",
    namibia: "english",
    nauru: "nauruan",
    nepal: "nepali",
    netherlands: "dutch",
    "new zealand": "english",
    nicaragua: "spanish",
    niger: "french",
    nigeria: "english",
    "north korea": "korean",
    "north macedonia": "macedonian",
    norway: "norwegian",
    oman: "arabic",
    pakistan: "urdu",
    palau: "palauan",
    "palestine state": "arabic",
    panama: "spanish",
    "papua new guinea": "tok pisin",
    paraguay: "spanish",
    peru: "spanish",
    philippines: "filipino",
    poland: "polish",
    portugal: "portuguese",
    qatar: "arabic",
    romania: "romanian",
    russia: "russian",
    rwanda: "kinyarwanda",
    "saint kitts and nevis": "english",
    "saint lucia": "english",
    "saint vincent and the grenadines": "english",
    samoa: "samoan",
    "san marino": "italian",
    "sao tome and principe": "portuguese",
    "saudi arabia": "arabic",
    senegal: "french",
    serbia: "serbian",
    seychelles: "french",
    "sierra leone": "english",
    singapore: "malay",
    slovakia: "slovak",
    slovenia: "slovene",
    "solomon islands": "english",
    somalia: "somali",
    "south africa": "zulu",
    "south korea": "korean",
    "south sudan": "english",
    spain: "spanish",
    "sri lanka": "sinhala",
    sudan: "arabic",
    suriname: "dutch",
    sweden: "swedish",
    switzerland: "german",
    syria: "arabic",
    taiwan: "mandarin",
    tajikistan: "tajik",
    tanzania: "swahili",
    thailand: "thai",
    "timor-leste": "portuguese",
    togo: "french",
    tonga: "tongan",
    "trinidad and tobago": "english",
    tunisia: "arabic",
    turkey: "turkish",
    turkmenistan: "turkmen",
    tuvalu: "tuvaluan",
    uganda: "english",
    ukraine: "ukrainian",
    "arab countries": "arabic",
    "united arab emirates": "arabic",
    "united kingdom": "english",
    "united states of america": "english",
    uruguay: "spanish",
    uzbekistan: "uzbek",
    vanuatu: "bislama",
    "vatican city": "italian",
    venezuela: "spanish",
    vietnam: "vietnamese",
    yemen: "arabic",

    arabic: "arabic",
    zambia: "english",
    zimbabwe: "english",
  };

  return (
    <div className="flex flex-col mb-2 justify-center items-center gap-10 text-purple-600">
      <h2 className="text-2xl justify-center items-center flex w-full text-center sm:text-2xl font-lora ">
        {emoji.title} {emoji.name} Emoji Name In Other Languages
      </h2>
      <table className="flex gap-3 w-full flex-col text-xs sm:text-sm  max-w-[1200px]">
        <thead className="grid grid-cols-3 sm:grid-cols-4 sm:gap-x-10 mb-1 underline underline-offset-2 decoration-[#94a3b8] w-full">
          <tr className="hidden sm:flex w-full">
            <th className="text-slate-700 font-nunito flex justify-center items-center w-full">
              Country Code
            </th>
          </tr>
          <tr className="flex w-full">
            <th className="text-slate-700 font-nunito flex justify-center items-center w-full">
              Country
            </th>
          </tr>
          <tr className="flex w-full">
            <th className="text-slate-700 font-nunito flex justify-center items-center w-full">
              Language
            </th>
          </tr>
          <tr className="flex w-full">
            <th className="text-slate-700 font-nunito flex justify-center items-center w-full">
              Name
            </th>
          </tr>
        </thead>
        <tbody className="flex  w-full flex-col gap-3">
          {emoji.languages.map(
            (language: {
              countryAbb: string;
              country: string;
              name: string;
            }) => (
              <tr
                key={uuidv4()}
                className="grid grid-cols-3 sm:grid-cols-4 sm:gap-x-10 w-full"
              >
                <td className="hidden sm:flex justify-center items-center w-full font-nunito text-slate-500  py-1 px-1 rounded-lg text-center capitalize">
                  {" "}
                  {language.countryAbb}
                </td>
                <td className="flex justify-center items-center w-full font-nunito text-slate-500  py-1 px-1 rounded-lg text-center capitalize">
                  {language.country.toLowerCase().includes("arab")
                    ? "Arab Countries"
                    : language.country}
                </td>
                <td className="flex justify-center items-center w-full font-nunito text-slate-500  py-1 px-1 rounded-lg text-center capitalize">
                  {language.country.toLowerCase().includes("arab")
                    ? "Arabic"
                    : languages[`${language?.country.toLowerCase()}`]}
                </td>
                <td className="flex justify-center items-center w-full font-nunito text-slate-500  py-1 px-1 rounded-lg text-center capitalize">
                  {language.name}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function Emoji() {
  const { emojiData } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col w-full font-lato justify-center items-center tracking-widest mt-12 leading-loose text-slate-600 text-lg gap-20">
      {[emojiData].map((emoji) => (
        <Fragment key={uuidv4()}>
          <EmojiPreview emoji={emoji} />
          <div className="bg-rose-50 w-full justify-center items-center py-10  flex ">
            <EmojiDetails emoji={emoji} />
          </div>
          <LanguageTable emoji={emoji} />
        </Fragment>
      ))}
    </div>
  );
}
