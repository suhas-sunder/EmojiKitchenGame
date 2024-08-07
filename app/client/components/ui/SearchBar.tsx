/* eslint-disable jsx-a11y/label-has-associated-control */
import useIsLoading from "../hooks/useIsLoading";

interface PropType {
  setSearchEmoji: (value: string) => void;
  customStyle?: string;
  placeholder?: string;
  customLabelStyle?: string;
  searchEmoji: string;
  uniqueId: string;
  handleDiceRoll?: () => void;
}

function SearchBar({
  setSearchEmoji,
  customStyle,
  placeholder,
  customLabelStyle,
  searchEmoji,
  uniqueId,
  handleDiceRoll,
}: PropType) {
  const { isLoading } = useIsLoading();

  return (
    <div
      className={`${customStyle} relative flex w-full justify-center items-center font-nunito mx-2`}
    >
      <div id="search-bar" className="-translate-y-24"></div>
      <label
        htmlFor={"search" + uniqueId}
        className={`flex absolute justify-end sm:justify-between w-full cursor-text text-purple-400 ${customLabelStyle}`}
      >
        <span className="hidden sm:flex py-3 -translate-x-[0.38em] translate-y-[0.05em] scale-75">🔍</span>
        <div className="flex ">
          {searchEmoji && (
            <button
              onClick={() => setSearchEmoji("")}
              className="flex p-[.46em] hover:scale-[1.15] text-xl hover:text-purple-700 text-purple-500"
            >
              x
            </button>
          )}
          <span className="py-3">| </span>
          <button
            title="🎲 Add Random Emoji To Search"
            onClick={handleDiceRoll}
            className="flex ml-2 py-3 p-3 hover:scale-[1.15]"
          >
            🎲
          </button>
        </div>
      </label>
      <input
        id={"search" + uniqueId}
        name="search bar"
        type="search"
        disabled={isLoading}
        onChange={(e) => setSearchEmoji(e.target.value.toLowerCase())}
        value={searchEmoji || ""}
        placeholder={placeholder || "Search"}
        className={`flex [&::-webkit-search-cancel-button]:hidden  placeholder:text-sm border-2 border-purple-300 rounded-md sm:pl-7 w-full my-2 text-sm sm:text-lg py-[0.5em] sm:py-[0.3em] text-purple-600 pl-2 sm:px-5 focus:border-purple-700 outline-none placeholder:text-purple-300`}
      />
    </div>
  );
}

export default SearchBar;
