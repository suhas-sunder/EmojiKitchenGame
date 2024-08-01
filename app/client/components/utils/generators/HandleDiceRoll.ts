import { Filename } from "../../../../routes/_index";

function HandleDiceRoll({ filenames }: { filenames: Filename[] }) {

  // Randomly select an emoji and add it to the search bar
  const randomEmoji = Math.floor(Math.random() * filenames?.length);
  return filenames[randomEmoji]?.keys?.split("~")[0];
}

export default HandleDiceRoll;
