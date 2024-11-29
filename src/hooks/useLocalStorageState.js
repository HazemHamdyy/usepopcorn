import { useEffect, useState } from "react";

export function useLocalStorageState(key) {
  const [value, setValue] = useState(function() {
    return JSON.parse(localStorage.getItem(key))
  });

  useEffect(function() {
    localStorage.setItem(key, JSON.stringify(value))
  },[value, key])

  return [value, setValue]
}