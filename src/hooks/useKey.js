import { useEffect } from "react"

export function useKey(key, returnFunc) {
  useEffect(function() {
    function callback(e) {
      if(e.code.toLowerCase() === key.toLowerCase()) {
        returnFunc()
      }
    }
    document.addEventListener('keydown', callback)

    return function() {
      document.removeEventListener('keydown', callback)
    }
  }, [returnFunc, key])
}