import { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Privacy Policy 🔏" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function privacypolicy() {
  return <div>games</div>;
}
