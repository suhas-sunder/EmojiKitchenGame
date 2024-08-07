import { useEffect, useState } from "react";

// Custom hook to handle window resize
export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Ensure code only runs on the client
    if (typeof window !== 'undefined') {
      const handleResize = () => setWindowWidth(window.innerWidth);

      // Initialize state with the current window width
      handleResize();

      // Add event listener
      window.addEventListener("resize", handleResize);

      // Cleanup event listener
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowWidth;
}
