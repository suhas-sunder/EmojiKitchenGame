import { MetaFunction } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "Emoji Games 🎲🎮👾🎴🎰" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function games() {
  return (
    <div>games</div>
  )
}
