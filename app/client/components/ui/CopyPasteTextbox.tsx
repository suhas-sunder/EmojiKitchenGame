import { Dispatch, SetStateAction } from "react";

interface PropType {
  displayCopyText: string;
  setDisplayCopyText: Dispatch<SetStateAction<string>>;
}

export default function CopyPasteTextbox({
  displayCopyText,
  setDisplayCopyText,
}: PropType) {
  return (
    <section className="flex flex-col fixed bottom-6 font-nunito px-5 w-full h-40 bg-white justify-center border-t-2 border-t-purple-200 items-center">
      <textarea
        placeholder="Copy, paste, edit, & save: Custom Text, emojis, & text faces. Paste your text here!"
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
        className="flex w-full placeholder:text-sm placeholder:sm:text-xl placeholder:md:text-2xl placeholder:tracking-widest  placeholder:leading-loose placeholder:text-center placeholder:-translate-x-5 placeholder:translate-y-2 max-w-[1200px] text-2xl border-2 tracking-widest h-full mt-3 mb-5 leading-loose rounded-md py-2 mx-10 [&::-webkit-search-cancel-button]:hidden scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 border-purple-300 pl-10 text-purple-600 focus:border-purple-700 outline-none placeholder:text-purple-300"
      />
    </section>
  );
}
