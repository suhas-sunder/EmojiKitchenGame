import { TotalsType } from "../../../routes/emoji-combos";
import trackingAPI from "../api/trackingAPI";

interface PropType {
  setTotalStats: (value: (prev: TotalsType[]) => TotalsType[]) => void;
}

function useUpdateLikes({ setTotalStats }: PropType) {
  const updateLikeCount = async (emoji_unicode: string) => {
    if (process.env.NODE_ENV === "development") return;
    const likedKey = `liked_${emoji_unicode}`;

    // Check if the emoji has already been liked
    if (localStorage.getItem(likedKey)) {
      return;
    }

    try {
      const response = await trackingAPI.post("/update-like-count", {
        emoji_unicode,
      });

      if (response.status === 200) {
        setTotalStats((prevStats) => {
          const statIndex = prevStats.findIndex(
            (stat) => stat.emoji_unicode === emoji_unicode
          );

          if (statIndex !== -1) {
            // Explicitly convert to number before adding
            const newLikes = Number(prevStats[statIndex].total_likes) + 1;
            const newStats = [...prevStats];
            newStats[statIndex] = {
              ...newStats[statIndex],
              total_likes: newLikes,
            };
            return newStats;
          } else {
            // Add a new stat entry for the emoji with explicit number values
            return [
              ...prevStats,
              { emoji_unicode, total_likes: 1, total_views: 0 },
            ];
          }
        });

        localStorage.setItem(likedKey, "true");
      } else {
        console.error(`Failed to update like count: ${response.status}`);
      }
    } catch (err) {
      let message: string;

      if (err instanceof Error) {
        message = err.message;
      } else {
        message = String(err);
      }

      console.error(message);
    }
  };

  return { updateLikeCount };
}

export default useUpdateLikes;
