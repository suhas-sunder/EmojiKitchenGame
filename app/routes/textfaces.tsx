import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Text Faces (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function TextFaces() {
  return <div>(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧</div>;
}