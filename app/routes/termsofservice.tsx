import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Terms of Service 📜" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function termsofservice() {
  return <div>games</div>;
}
