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
    id="search-bar"
      className={`${customStyle} relative flex w-full justify-center items-center font-nunito mx-5`}
    >
      <label
        htmlFor={"search" + uniqueId}
        className={`flex absolute justify-between w-full cursor-text text-purple-400 ${customLabelStyle}`}
      >
        <span className="flex  py-3">🔍</span>
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
            className="flex p-3 hover:scale-[1.15]"
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
        className={`flex [&::-webkit-search-cancel-button]:hidden border-2 border-purple-300 rounded-md pl-10 w-full my-2 text-lg py-[0.3em] text-purple-600 px-5 focus:border-purple-700 outline-none placeholder:text-purple-300`}
      />
    </div>
  );
}

export default SearchBar;
