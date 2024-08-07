import { useEffect, useState } from "react";

//Apply tailwind animations on page load
export default function useLoadAnimation() {
  const [loadAnimation, setLoadAnimation] = useState<boolean>(false);

  const fadeAnim = loadAnimation
    ? "opacity-100 transition-opacity duration-200 ease-in"
    : "opacity-0";

  useEffect(() => {
    setLoadAnimation(true);
  }, []);

  return {
    fadeAnim,
  };
}
