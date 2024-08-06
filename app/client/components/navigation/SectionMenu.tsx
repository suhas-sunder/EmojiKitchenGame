import { Link } from "@remix-run/react";

interface PropType {
  object: { [key: string]: unknown };
}

function SectionMenu({ object }: PropType) {
  return (
    <>
      <ul className="grid grid-cols-2 font-nunito sm:grid-cols-3 md:grid-cols-4 mx-5 lg:grid-cols-6 gap-5 bg-purple-100 overflow-auto max-h-[19em] scrollbar-thin border-2 rounded-lg border-purple-50 py-5 px-5 scrollbar-thumb-purple-500 scrollbar-track-purple-200">
        <li className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-6 flex justify-center items-center text-purple-600 text-lg sm:text-xl ">
          <h2>Menu</h2>
        </li>
        {Object.keys(object).map((key, index) => (
          <li key={key + index + "menu"} className="flex">
            <Link
              aria-label={`Menu link that navigates to ${key} section`}
              className="flex border-2 text-xs sm:text-sm rounded-lg text-purple-500 w-full hover:scale-110 border-purple-200 bg-white hover:border-purple-400 hover:text-purple-700  text-center justify-center items-center px-5 py-2"
              to={"#" + key}
            >
              {key.split("-").join(" ")}
            </Link>
          </li>
        ))}
      </ul>
      {/* <p className="text-center font-nunito px-5 sm:text-lg mx-5 tracking-widest leading-loose text-slate-600">
        (*＾▽＾)／ Hello friend! Use the above menu to navigate to different
        faces. Click a face below to copy and paste it!
      </p> */}
    </>
  );
}

export default SectionMenu;
