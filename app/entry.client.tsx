import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
// eslint-disable-next-line import/no-named-as-default
import { posthog } from "posthog-js";

function PosthogInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(() => {
        posthog.init("phc_mLbknZ7mYfJxODEdfCwb8T2Rmc6S488fHIiU9TARqWM", {
          api_host: "https://us.i.posthog.com",
          person_profiles: "identified_only", // or 'always' for anonymous profiles
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback support
      posthog.init("phc_mLbknZ7mYfJxODEdfCwb8T2Rmc6S488fHIiU9TARqWM", {
        api_host: "https://us.i.posthog.com",
        person_profiles: "identified_only",
      });
    }
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
