import { Outlet, useOutletContext } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";
export default function CopyPaste() {
  const {
    copyText,
    setCopyText,
    displayCopyText,
    setDisplayCopyText,
    textareaIsHidden,
    setTextareaIsHidden,
  } = useOutletContext<{
    copyText: string;
    setCopyText: Dispatch<SetStateAction<string>>;
    displayCopyText: string;
    setDisplayCopyText: Dispatch<SetStateAction<string>>;
    textareaIsHidden: boolean;
    setTextareaIsHidden: Dispatch<SetStateAction<boolean>>;
  }>(); //I've setup an outlet context in root route, so it can be accessed in all routes, but since I have another context here I need to pass the data again.

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
