import { json, MetaFunction } from "@remix-run/node";

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
export function loader() {
  // This will handle the request and return a 404 response
  return json({ error: "Not Found" }, { status: 404 });
}

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Handle POST request (bot or other unknown POST routes)
  return new Response("Not Found", { status: 404 });
};

export default function ErrorBoundary() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-rose-500">🥺 Uh Oh, 404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-800">
        Page Not Found...
      </h2>
      <p className="mt-2 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </a>
    </div>
  );
}
