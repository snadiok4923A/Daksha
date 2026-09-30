import { useCallback, useEffect, useRef, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage.js'

/** useState that persists to localStorage (JSON). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJSON(key, initialValue))
  const keyRef = useRef(key)

  useEffect(() => {
    keyRef.current = key
  }, [key])

  const set = useCallback((next) => {
    setValue((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next
      writeJSON(keyRef.current, resolved)
      return resolved
    })
  }, [])

  return [value, set]
}

export default useLocalStorage
