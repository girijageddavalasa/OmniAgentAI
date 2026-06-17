import { useJourney } from "@/lib/journey-store";
import { Star } from "lucide-react";
import { useState } from "react";

export function FeedbackBar({ context }: { context: string }) {
  const { submitFeedback } = useJourney();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-xl border bg-emerald-50 text-emerald-800 px-4 py-3 text-sm">
        Thanks! Feedback captured and forwarded to the Churn Analysis Agent.
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-soft">
      <div className="text-sm font-medium">How was this experience?</div>
      <div className="text-xs text-muted-foreground mb-3">{context}</div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="p-1"
            aria-label={`${n} star`}
          >
            <Star
              className={`size-5 transition ${
                (hover || rating) >= n ? "fill-amber-400 stroke-amber-500" : "stroke-muted-foreground/50"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Add a comment (optional)"
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          disabled={!rating}
          onClick={() => { submitFeedback(context, rating, comment); setSent(true); }}
          className="rounded-md gradient-brand px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
