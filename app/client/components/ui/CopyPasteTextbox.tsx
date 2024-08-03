import { Dispatch, SetStateAction } from "react";

interface PropType {
  displayCopyText: string;
  setDisplayCopyText: Dispatch<SetStateAction<string>>;
  isHidden: boolean;
  setIsHidden: Dispatch<SetStateAction<boolean>>;
}

export default function CopyPasteTextbox({
  displayCopyText,
  setDisplayCopyText,
  isHidden,
  setIsHidden,
}: PropType) {
  return (
    <section
      className={`${
        isHidden ? "h-0 translate-y-[1.7em] sm:translate-y-[1.2em]" : "h-40"
      } flex flex-col fixed bottom-6 font-nunito px-5 w-full bg-white justify-center border-t-2 border-t-purple-200 items-center`}
    >
      <div className="flex w-full relative  max-w-[1200px]">
        <button
          onClick={() => setIsHidden(!isHidden)}
          title={isHidden ? "Show Textarea" : "Hide Textarea"}
          className="absolute -top-[3.3rem] -right-3 hover:bg-rose-400 bg-rose-100 rounded-t-lg p-2 text-3xl"
        >
          {!isHidden ? "🫣" : "😉"}
        </button>
      </div>
      <textarea
        placeholder="Copy, paste, edit, & save: Custom Text, emojis, & text faces. Paste your text here! Also, you can navigate to other pages without losing your progress! (^‿^ 🌸)"
        title="Paste your text here"
        aria-label="Copy, paste, edit, & save: Custom Text, emojis, & text faces. Paste your text here!"
        aria-required="true"
        aria-invalid="true"
        aria-describedby="copy-paste"
        name="copy-paste"
        autoComplete="off"
        spellCheck="false"
        value={displayCopyText}
        onChange={(e) => setDisplayCopyText(e.target.value)}
        id="copy-paste"
        className="flex w-full placeholder:text-sm resize-none placeholder:sm:text-xl placeholder:md:text-2xl placeholder:tracking-widest  placeholder:leading-loose placeholder:text-center placeholder:-translate-x-5 placeholder:translate-y-2 max-w-[1200px] text-2xl border-2 tracking-widest h-full mt-3 mb-5 leading-loose rounded-md py-2 mx-10 [&::-webkit-search-cancel-button]:hidden scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 border-purple-300 pl-10 text-purple-600 focus:border-purple-700 outline-none placeholder:text-purple-300"
      />
    </section>
  );
}