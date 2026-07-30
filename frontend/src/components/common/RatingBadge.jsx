import { Star } from "lucide-react";
import { formatNumber } from "../../utils/formatters.js";

export default function RatingBadge({ rating, votes, className = "" }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-500 backdrop-blur-md ${className}`}
    >
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <span>{rating}</span>
      {votes ? (
        <span className="text-[10px] text-amber-400/80 font-normal">
          ({formatNumber(votes)})
        </span>
      ) : null}
    </div>
  );
}
