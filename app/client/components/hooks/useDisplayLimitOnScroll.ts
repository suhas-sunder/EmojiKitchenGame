import { useEffect } from "react";

interface PropType {
  displayLimit: number;
  setDisplayLimit: (value: number) => void;
}

function useDisplayLimitOnScroll({ displayLimit, setDisplayLimit }: PropType) {
  useEffect(() => {
    const handleScroll = () => {
      if (displayLimit < 1000) {
        setDisplayLimit(1000);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [displayLimit, setDisplayLimit]);
}

export default useDisplayLimitOnScroll;
