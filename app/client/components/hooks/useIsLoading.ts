import { useEffect, useState } from "react";

export default function useIsLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return { isLoading };
}
