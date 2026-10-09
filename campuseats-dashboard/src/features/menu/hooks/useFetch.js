import { useEffect, useState } from "react";

export function useFetch(url, initialData = []) {
  const [result, setResult] = useState({ url: null, data: undefined, error: null });

  useEffect(() => {
    let active = true;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((json) => {
        if (active) setResult({ url, data: json, error: null });
      })
      .catch((err) => {
        if (active) setResult({ url, data: undefined, error: err.message });
      });

    return () => {
      active = false;
    };
  }, [url]);

  // Result belongs to the current url only once the fetch for it has finished
  const isLoading = result.url !== url;

  return {
    data: !isLoading && result.data !== undefined ? result.data : initialData,
    isLoading,
    error: isLoading ? null : result.error,
  };
}