import { MetaFunction } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "Emojis & Meanings 😊" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function emojis() {
  return (
    <div>games</div>
  )
}
