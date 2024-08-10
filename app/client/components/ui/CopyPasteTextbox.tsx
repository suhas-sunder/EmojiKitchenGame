import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

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
  const editableRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Sync the `displayCopyText` with the `contentEditable` div's innerHTML
  useEffect(() => {
    if (
      editableRef.current &&
      editableRef.current.innerHTML !== displayCopyText
    ) {
      editableRef.current.innerHTML = displayCopyText;
    }
  }, [displayCopyText]);

  // Handle input events in the contentEditable div
  const handleInput = () => {
    if (editableRef.current) {
      setDisplayCopyText(editableRef.current.innerHTML);
    }
  };

  // Handle paste events to insert text or images
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
    const items = clipboardData.items;
    let pastedImage = false;

    // Iterate through clipboard items to detect images
    for (const item of items) {
      if (item.type.startsWith("image")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgElement = document.createElement("img");
          imgElement.src = event.target?.result as string;
          imgElement.style.maxWidth = "100%";
          imgElement.style.height = "auto";
          imgElement.style.display = "block";

          // Insert image at the current cursor position
          const selection = window.getSelection();
          if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(imgElement);
          }
          setDisplayCopyText(editableRef.current?.innerHTML || "");
        };
        if (file) {
          reader.readAsDataURL(file);
        }
        pastedImage = true;
      }
    }

    // If no image is pasted, insert text normally
    if (!pastedImage) {
      const text = clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      setDisplayCopyText(editableRef.current?.innerHTML || "");
    }
  };

  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur event
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Copy content to clipboard
  const copyToClipboard = async () => {
    if (editableRef.current) {
      const content = editableRef.current.innerHTML;

      try {
        // Create a temporary HTML string and convert it to a Blob
        const htmlBlob = new Blob([content], { type: "text/html" });

        // Use the Clipboard API to copy the content
        await navigator.clipboard.write([
          new ClipboardItem({
            [htmlBlob.type]: htmlBlob,
          }),
        ]);

        // Show tooltip
        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 2000); // Hide tooltip after 2 seconds
      } catch (err) {
        console.error("Failed to copy content: ", err);
      }
    }
  };

  // Clear content
  const clearContent = () => {
    if (editableRef.current) {
      editableRef.current.innerHTML = "";
      setDisplayCopyText("");
    }
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const imgElement = document.createElement("img");
          imgElement.src = event.target?.result as string;
          imgElement.style.maxWidth = "100%";
          imgElement.style.height = "auto";
          imgElement.style.display = "block";

          // Insert image at the current cursor position
          const selection = window.getSelection();
          if (selection?.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(imgElement);
          }
          setDisplayCopyText(editableRef.current?.innerHTML || "");
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <section
      className={`${
        isHidden
          ? "h-0 touch-none translate-y-[1.7em] sm:translate-y-[1.2em]"
          : "h-40"
      } flex flex-col fixed bottom-6 font-nunito px-5 w-full bg-white justify-center border-t-2 border-t-purple-200 items-center`}
    >
      <div className="relative flex w-full max-w-[1200px] z-10">
        <button
          onClick={() => setIsHidden(!isHidden)}
          title={isHidden ? "👀 Show Textbox" : "🕶️ Hide Textbox"}
          className="absolute -top-[3.3rem] max-w-14 -right-3 hover:bg-rose-400 bg-rose-100 rounded-t-lg p-2 text-3xl"
        >
          {!isHidden ? "🫣" : "😉"}
        </button>

        {/* Clear button */}
        <button
          onClick={clearContent}
          title="Clear Content"
          className="absolute -bottom-[2.9em] right-[0.9em] p-2 text-xl text-white rounded-full hover:scale-125  focus:outline-none"
        >
          ❌
        </button>
      </div>
      <div className="relative flex w-full max-w-[1200px] z-10">
        <button
          onClick={copyToClipboard}
          title="Copy to Clipboard"
          className="absolute -bottom-[4.6em] right-2 p-2 text-3xl text-white rounded-full hover:scale-125 focus:outline-none"
        >
          📋
        </button>
        {/* Tooltip for the copy button */}
        {tooltipVisible && (
          <div className="absolute -bottom-[7.3em] -right-[0.4em] px-2 py-2 text-xs text-white bg-slate-700 rounded shadow-lg">
            Copied! 🎉
          </div>
        )}
      </div>

      {/* Wrapper to handle relative positioning of placeholder */}
      <div
        className="relative flex touch-none w-full max-w-[1200px] text-xl border-2 border-purple-300 tracking-widest h-full mt-3 mb-5 leading-loose rounded-md scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 px-1 sm:px-3 pt-1 text-purple-600 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Custom placeholder */}
        <div
          className={`absolute left-0 right-0 top-1 flex items-center justify-center text-sm sm:text-lg tracking-widest leading-loose text-center text-purple-300 transition-opacity duration-300 ${
            !isFocused && displayCopyText.trim() === ""
              ? "opacity-100"
              : "opacity-0"
          } pointer-events-none`}
        >
          Copy, paste, edit, & save: Custom Text, emojis, & text faces. Paste
          your text here! Also, you can navigate to other pages without losing
          your progress! (^‿^ 🌸)
        </div>

        {/* Content editable div */}
        <div
          ref={editableRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label="Copy, paste, edit, & save: Custom Text, emojis, & text faces. Paste your text here!"
          aria-required="true"
          aria-invalid="true"
          aria-describedby="copy-paste"
          spellCheck="false"
          id="copy-paste"
          className="w-full h-full focus:outline-none pt-1"
        ></div>
      </div>
    </section>
  );
}
