import { MetaFunction, useMatches } from "@remix-run/react";
import { useMemo } from "react";

interface RouteData {
  filenames?: string[];
}

function isRouteData(data: unknown): data is RouteData {
  return typeof data === 'object' && data !== null && 'filenames' in data;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Emoji" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Emoji() {
  const matches = useMatches();

  // Use type guard to check if the data is of the expected type
  const filenames = useMemo(
    () => (isRouteData(matches[0]?.data) ? matches[0].data.filenames : []),
    [matches]
  );

  console.log(filenames, matches);

  return (
    <div>
      <p></p>
    </div>
  );
}
