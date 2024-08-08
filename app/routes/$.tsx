import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {
      title: "404 Page Not Found! 🥺",
    },
    {
      name: "description",
      content:
        "Oops! The page you are looking for doesn't exist. Please check the URL or return to the homepage! 🎉📲",
    },
  ];
};

export default function NotFound() {
  return (
    <div className="flex w-full justify-center items-center h-[100vh] font-nunito text-4xl text-rose-500">
      <h1>404 Page Not Found! 🥺</h1>
    </div>
  );
}
