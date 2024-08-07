import { useState, useEffect } from "react";

// Custom hook to handle responsive behavior
const useResponsive = () => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  //For large screens display the emoji combo menu by default, but hide for small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1023) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize); // Add event listener to handle resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener on unmount
    };
  }, []); // Empty dependency array means this runs only on mount and unmount

  return {
    isHidden,
    setIsHidden,
  };
};

export default useResponsive;
