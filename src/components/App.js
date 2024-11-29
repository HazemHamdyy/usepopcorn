import { useState } from "react";
import NavBar from "./NavBar";
import Search from "./Search";
import NumResults from "./NumResults";
import Main from "./Main";
import Box from "./Box";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import MovieList from "./MovieList";
import WatchedSummery from "./WatchedSummery";
import WatchedList from "./WatchedList";
import MovieDetails from "./MovieDetails";
import { useFetch } from "../hooks/useFetch";
import { useLocalStorageState } from "../hooks/useLocalStorageState";



export default function App() {

  

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedWatchedRate, setSelectedWatchedRate] = useState(null);
  const {value: movies, isLoading, error} = useFetch(query)
  const [watched, setWatched] = useLocalStorageState('watched')

  function handleSelectMovie(id) {
    setSelectedId(id === selectedId ? null : id);
    if (id !== selectedId) {
      const movie = watched.find((movie) => movie.imdbID === id);
      if (movie) {
        setSelectedWatchedRate(movie.userRating);
      } else {
        setSelectedWatchedRate(null);
      }
    } else {
      setSelectedWatchedRate(null);
    }
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

 


  return (
    <>
      <NavBar>
        <Search query={query} onSearch={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              selectedWatchedRate={selectedWatchedRate}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedList watched={watched} onDeleteWatched={handleDeleteWatched}/>
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
