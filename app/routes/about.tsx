import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "About Me 🩻" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function about() {
  return <div>games</div>;
}
