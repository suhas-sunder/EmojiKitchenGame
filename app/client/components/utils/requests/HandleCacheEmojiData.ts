import localforage from "localforage";
import { emojiDataType } from "../../../../routes/_index";
import cloudflareR2API from "../../api/cloudflareR2API";
/**
 * This function loads emoji filenames from the server or cache.
 * It first checks if the emoji filenames is already cached in local storage.
 * If it is, it returns the cached filenames.
 * If it is not cached, it fetches the filenames from the server and caches it. *
 * @param {string} emojiUnicode - The Unicode of the emoji to load.
 * @returns {Promise<{ id: string, keys: string }[] | undefined>} - A promise that resolves to an array of emoji filenames objects, or undefined if there was an error.
 */

async function HandleCacheEmojiData(emojiUnicode: string) {
  try {
    // Check if the emoji filenames is already cached in local storage
    const cachedEmojiData = await localforage.getItem<emojiDataType>(
      emojiUnicode
    );

    // If the emoji filenames is cached, save it to state
    if (cachedEmojiData) {
      return cachedEmojiData;
    } else {
      // If the emoji filenames is not cached, fetch it from the server, cache it, and save it to state
      const response = await cloudflareR2API
        .get(
          `/emojis/${
            emojiUnicode.length < 9 ? emojiUnicode.slice(1) : emojiUnicode
          }.json`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => response.data);

      if (response) {
        await localforage.setItem(emojiUnicode, response);
        return response;
      }
    }
  } catch (error) {
    // If there is an error fetching the emoji filenames, log the error
    console.error("Error fetching emoji filenames:", error);
  }
}

export default HandleCacheEmojiData;
