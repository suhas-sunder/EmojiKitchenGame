import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
// eslint-disable-next-line import/no-named-as-default
import { posthog } from "posthog-js";

function PosthogInit() {
  useEffect(() => {
    const timer = setTimeout(() => {
      posthog.init("phc_mLbknZ7mYfJxODEdfCwb8T2Rmc6S488fHIiU9TARqWM", {
        api_host: "https://us.i.posthog.com",
        person_profiles: "identified_only", // or 'always' for anonymous users
      });
    }, 5000); // 5 seconds delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return null;
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  );
});
