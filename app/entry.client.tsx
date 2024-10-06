/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";
// eslint-disable-next-line import/no-named-as-default
import posthog from "posthog-js";

function PosthogInit() {
  useEffect(() => {
    posthog.init("phc_mLbknZ7mYfJxODEdfCwb8T2Rmc6S488fHIiU9TARqWM", {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    });
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
