import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import { useKey } from "../hooks/useKey";

const KEY = "76b7c46d";

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  selectedWatchedRate
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userRating, setUserRatig] = useState(selectedWatchedRate);
  const [isAdded, setIsAdded] = useState(selectedWatchedRate ? true: false);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
    imdbID,
  } = movie;

  function handleAdd() {
    const newMovie = {
      imdbID,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ")[0]),
      title,
      poster,
      userRating,
    };
    onAddWatched(newMovie);
    setIsAdded(true);
  }

  function handleSetRating(rating) {
    setUserRatig(rating);
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );
          if (!res.ok) throw new Error("Something went wrong with fetching");
          const data = await res.json();
          if (!data) {
            throw new Error("Movie not found");
          }
          setMovie(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      getMovieDetails();
    },
    [selectedId, selectedWatchedRate]
  );

  useEffect(function() {
    setUserRatig(selectedWatchedRate)
    setIsAdded(selectedWatchedRate ? true: false)
  },[selectedId, selectedWatchedRate])

  useEffect(function() {
    if(!title) return;
    document.title = `MOVIE | ${title}`
    return function() {
      document.title = 'usePopcorn'
    }
  },[title])

 useKey('Escape', onCloseMovie)


  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isAdded ? (
                <p>{`You have rated the movie ${userRating} ⭐️`}</p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={handleSetRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to List
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
