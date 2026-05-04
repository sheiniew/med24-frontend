import { RiStarFill, RiStarLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

export function StarRating({ rating, setRating, interactive = false }) {

  const navigate = useNavigate();
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => {
            if(interactive) {
              setRating(star)
            }
          }}
          className={`${interactive ? "cursor-pointer" : ""} text-xl`}
        >
          {star <= rating ? (
            <RiStarFill className="text-yellow-400" />
          ) : (
            <RiStarLine className="text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
}