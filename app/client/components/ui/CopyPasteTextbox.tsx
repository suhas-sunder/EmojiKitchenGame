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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [hasText, setHasText] = useState<boolean>(false);
  const [textBoxSize, setTextBoxSize] = useState<string>("h-[10em]");

  useEffect(() => {
    if (editableRef.current && editableRef.current.innerHTML !== displayCopyText) {
      editableRef.current.innerHTML = displayCopyText;
    }
    setHasText(editableRef.current?.innerHTML.trim() !== "");
  }, [displayCopyText]);

  const handleInput = () => {
    if (editableRef.current) {
      setDisplayCopyText(editableRef.current.innerHTML);
      setHasText(editableRef.current.innerHTML.trim() !== "");
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardData = e.clipboardData;
    const items = clipboardData.items;
    let pastedImage = false;

    for (const item of items) {
      if (item.type.startsWith("image")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgElement = document.createElement("img");
            imgElement.src = event.target?.result as string;
            imgElement.style.maxWidth = "100%";
            imgElement.style.height = "auto";
            imgElement.style.display = "block";

            const selection = window.getSelection();
            if (selection?.rangeCount) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(imgElement);
            }
            setDisplayCopyText(editableRef.current?.innerHTML || "");
            setHasText(editableRef.current?.innerHTML.trim() !== "");
          };
          reader.readAsDataURL(file);
        }
        pastedImage = true;
        break;
      }
    }

    if (!pastedImage) {
      setTimeout(() => {
        setDisplayCopyText(editableRef.current?.innerHTML || "");
        setHasText(editableRef.current?.innerHTML.trim() !== "");
      }, 0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgElement = document.createElement("img");
        imgElement.src = event.target?.result as string;
        imgElement.style.maxWidth = "100%";
        imgElement.style.height = "auto";
        imgElement.style.display = "block";

        const selection = window.getSelection();
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(imgElement);
        }
        setDisplayCopyText(editableRef.current?.innerHTML || "");
        setHasText(editableRef.current?.innerHTML.trim() !== "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const copyToClipboard = async () => {
    if (editableRef.current) {
      const content = editableRef.current.innerHTML;

      try {
        const htmlBlob = new Blob([content], { type: "text/html" });

        await navigator.clipboard.write([
          new ClipboardItem({
            [htmlBlob.type]: htmlBlob,
          }),
        ]);

        setTooltipVisible(true);
        setTimeout(() => setTooltipVisible(false), 2000);
      } catch (err) {
        console.error("Failed to copy content: ", err);
      }
    }
  };

  const clearContent = () => {
    if (editableRef.current) {
      editableRef.current.innerHTML = "";
      setDisplayCopyText("");
      setHasText(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.dataTransfer.items;
    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgElement = document.createElement("img");
            imgElement.src = event.target?.result as string;
            imgElement.style.maxWidth = "100%";
            imgElement.style.height = "auto";
            imgElement.style.display = "block";

            const selection = window.getSelection();
            if (selection?.rangeCount) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(imgElement);
            }
            setDisplayCopyText(editableRef.current?.innerHTML || "");
            setHasText(editableRef.current?.innerHTML.trim() !== "");
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  return (
    <section
      className={`${
        isHidden
          ? "h-0 translate-y-[1.7em] sm:translate-y-[1.2em]"
          : `${textBoxSize}`
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

        {hasText && (
          <button
            onClick={clearContent}
            title="Clear Content"
            className="absolute -bottom-[2.9em] right-[0.9em] p-2 text-xl text-white rounded-full hover:scale-125 focus:outline-none"
          >
            ❌
          </button>
        )}
      </div>
      <div className="relative flex w-full max-w-[1200px] z-10">
        {hasText && (
          <button
            onClick={copyToClipboard}
            title="Copy to Clipboard"
            className="absolute -bottom-[4.6em] right-2 p-2 text-3xl text-white rounded-full hover:scale-125 focus:outline-none"
          >
            📋
          </button>
        )}
        {tooltipVisible && (
          <div className="absolute -bottom-[7.3em] -right-[0.4em] px-2 py-2 text-xs text-white bg-slate-700 rounded shadow-lg">
            Copied! 🎉
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`${textBoxSize === "h-[10em]" && "-bottom-[7em]"} ${
            textBoxSize === "h-[20em]" && "-bottom-[15em]"
          } ${
            textBoxSize === "h-[40em]" && "-bottom-[31em]"
          } absolute left-1 p-2 text-xl text-white rounded-full hover:scale-125 focus:outline-none`}
          title="Upload Image"
        >
          📷
        </button>
        <button
          onClick={() => setTextBoxSize("h-[10em]")}
          className={`${textBoxSize === "h-[10em]" && "-bottom-[8.2em]"} ${
            textBoxSize === "h-[20em]" && "-bottom-[17em]"
          } ${
            textBoxSize === "h-[40em]" && "-bottom-[34.75em]"
          } absolute left-[2.4em] p-2 text-lg text-purple-700 rounded-full hover:scale-125 focus:outline-none`}
          title="Default Textbox Size"
        >
          1X
        </button>
        <button
          onClick={() => setTextBoxSize("h-[20em]")}
          className={`${textBoxSize === "h-[10em]" && "-bottom-[8.2em]"} ${
            textBoxSize === "h-[20em]" && "-bottom-[17em]"
          } ${
            textBoxSize === "h-[40em]" && "-bottom-[34.75em]"
          } absolute left-[4.4em] p-2 text-lg text-purple-700 rounded-full hover:scale-125 focus:outline-none`}
          title="Double Textbox Size"
        >
          2X
        </button>
        <button
          onClick={() => setTextBoxSize("h-[40em]")}
          className={`${textBoxSize === "h-[10em]" && "-bottom-[8.2em]"} ${
            textBoxSize === "h-[20em]" && "-bottom-[17em]"
          } ${
            textBoxSize === "h-[40em]" && "-bottom-[34.75em]"
          } absolute left-[6.4em] p-2 text-lg text-purple-700 rounded-full hover:scale-125 focus:outline-none`}
          title="Quadruple Textbox Size"
        >
          4X
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <div
        className="relative flex w-full max-w-[1200px] text-xl border-2 border-purple-300 tracking-widest h-full mt-3 mb-5 leading-loose rounded-md scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-200 px-1 sm:px-3 pt-1 text-purple-600 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
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
          className="w-full h-full pb-[60em] focus:outline-none pt-1"
        ></div>
      </div>
    </section>
  );
}
