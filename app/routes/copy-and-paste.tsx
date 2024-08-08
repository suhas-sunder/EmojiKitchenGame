import { MetaFunction } from "@remix-run/node";
import { Outlet, useOutletContext } from "@remix-run/react";
import { Dispatch, SetStateAction } from "react";

export const meta: MetaFunction = () => {
  return [
    {
      title:
        "Copy and paste Cute and Creative Text Emoticons! - Text Faces (ﾉ◕ヮ◕) …",
    },
    {
      name: "description",
      content:
        "😊 Discover a variety of cute and creative text emoticons and text faces to express yourself in unique ways! From happy smiles (╥﹏╥) to powerful flexes (ง'̀-'́)ง, our collection has something for every mood. Explore and copy your favorites!",
    },
  ];
};

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
