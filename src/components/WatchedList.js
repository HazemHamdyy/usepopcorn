import WatchedMovie from "./WatchedMovie";

export default function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched}/>
      ))}
    </ul>
  );
}