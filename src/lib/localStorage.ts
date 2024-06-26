import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): {
  storedValue: T;
  setStoredValue: Dispatch<SetStateAction<T>>;
  fetchFromLocal: () => T;
  // refetchFromLocal: () => void;
} {
  const [storedValue, setStoredValue] = useState(initialValue);
  // We will use this flag to trigger the reading from localStorage
  const [firstLoadDone, setFirstLoadDone] = useState(false);

  const fetchFromLocal = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  // Use an effect hook in order to prevent SSR inconsistencies and errors.
  // This will update the state with the value from the local storage after
  // the first initial value is applied.
  useEffect(() => {
    if (firstLoadDone) {
      return;
    }

    // Set the value from localStorage
    setStoredValue(fetchFromLocal());
    // First load is done
    setFirstLoadDone(true);
  }, [initialValue, key, fetchFromLocal]);

  // // Instead of replacing the setState function, react to changes.
  // // Whenever the state value changes, save it in the local storage.
  useEffect(() => {
    // If it's the first load, don't store the value.
    // Otherwise, the initial value will overwrite the local storage.
    if (!firstLoadDone) {
      return;
    }

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.log(error);
    }
  }, [storedValue, firstLoadDone, key]);

  // Return the original useState functions
  return { storedValue, setStoredValue, fetchFromLocal };
}
