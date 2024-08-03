import { useEffect, useState } from "react";

export default function useManageCopiedMsg() {
  const [isCopied, setIsCopied] = useState<string>("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      isCopied && setIsCopied("");
    }, 400);

    return () => clearTimeout(timeout);
  }, [isCopied]);

  return {
    isCopied,
    setIsCopied,
  };
}
