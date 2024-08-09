import { TotalsType } from "../../../routes/emoji-combos";

interface PropType {
  unicode: string;
  totalStats: TotalsType[];
}

function LikesAndViews({ unicode, totalStats }: PropType) {
  return (
    <>
      <div className="grid grid-cols-2 underline underline-offset-2 text-sm text-purple-400 justify-center w-full items-center gap-5">
        <div className="flex  justify-center items-center w-full">Likes</div>
        <div className="flex  justify-center items-center w-full">Views</div>
      </div>
      <div className="grid grid-cols-2 justify-center mb-2 text-purple-500 w-full items-center gap-5">
        <div>
          💖{" "}
          {totalStats
            ?.filter((total: TotalsType) => total?.emoji_unicode === unicode)[0]
            ?.total_likes.toLocaleString("en-US") || 0}
        </div>
        <div>
          👁️{" "}
          {totalStats
            ?.filter((total: TotalsType) => total?.emoji_unicode === unicode)[0]
            ?.total_views.toLocaleString("en-US") || 0}
        </div>
      </div>
    </>
  );
}

export default LikesAndViews;
