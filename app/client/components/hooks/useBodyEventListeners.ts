import { useEffect } from "react";

interface PropType {
  setDisplayLimit: (value: number) => void;
}

const useBodyEventListeners = ({ setDisplayLimit }: PropType) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMouseEnter = () => setDisplayLimit(1000);

      // Add event listeners
      document.body.addEventListener("mouseenter", handleMouseEnter);

      // Clean up event listeners on unmount
      return () => {
        document.body.removeEventListener("mouseenter", handleMouseEnter);
      };
    }
  }, [setDisplayLimit]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth <= 1022) {
      // Set display limit on load for screens with width <= 1022px after a delay
      const timeoutId = setTimeout(() => setDisplayLimit(1000), 1000); // 1 second delay

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [setDisplayLimit]);
};

export default useBodyEventListeners;
