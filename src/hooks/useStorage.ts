/**
 * chrome.storage.local 的 React hook 封装
 *
 * @author QinFeng Luo
 * @date 2026/03/04
 */

import { useState, useEffect, useCallback } from "react";

export function useStorage<T>(key: string) {
  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(key, (result) => {
      setDataState((result[key] as T) ?? null);
      setLoading(false);
    });

    const listener = (changes: { [k: string]: chrome.storage.StorageChange }) => {
      if (changes[key]) {
        setDataState((changes[key].newValue as T) ?? null);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [key]);

  const setData = useCallback(
    async (value: T) => {
      await chrome.storage.local.set({ [key]: value });
      setDataState(value);
    },
    [key],
  );

  const removeData = useCallback(async () => {
    await chrome.storage.local.remove(key);
    setDataState(null);
  }, [key]);

  return { data, setData, removeData, loading };
}
