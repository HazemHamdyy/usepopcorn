import { useEffect, useState } from "react";

const KEY = "76b7c46d";
export function useFetch(query) {
  const [value, setValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        if (query.length < 3) {
          setValue([]);
          setError("");
          setIsLoading(false);
          return;
        }
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) throw new Error("Something went wrong with fetching");
          const data = await res.json();

          if (!data.Search) {
            throw new Error("Movie not found");
          }
          setValue(data.Search || []);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally{
          setIsLoading(false);
        }
      }
      // handleCloseMovie()
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  console.log(isLoading)
  return {value, isLoading, error}
}
