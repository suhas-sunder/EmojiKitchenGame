import { useState } from "react";

function useSearch() {
  const [searchEmoji, setSearchEmoji] = useState<string>("");

  return { searchEmoji, setSearchEmoji }
}

export default useSearch