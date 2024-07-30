import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Emojis Tools 📱" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Tools() {
  return <div>games</div>;
}
