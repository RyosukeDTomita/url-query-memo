import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UseUrlStateOptions<T> {
  encode?: (value: T) => string;
  decode?: (value: string) => T;
}

export function useUrlState<T = string>(
  key: string,
  initialValue: T,
  options?: UseUrlStateOptions<T>
): [T, (newValue: T) => void] {
  const router = useRouter();
  const searchParams = useSearchParams();

  const encode = options?.encode || ((value: T) => String(value));
  const decode = options?.decode || ((value: string) => value as T);

  const [state, setState] = useState<T>(() => {
    const urlValue = searchParams.get(key);
    if (urlValue !== null) {
      try {
        return decode(urlValue);
      } catch {
        return initialValue;
      }
    }
    return initialValue;
  });

  const setValue = useCallback((newValue: T) => {
    setState(newValue);

    const params = new URLSearchParams(searchParams.toString());
    const encodedValue = encode(newValue);

    if (encodedValue === '' || encodedValue === encode(initialValue)) {
      params.delete(key);
    } else {
      params.set(key, encodedValue);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : '?';
    router.replace(newUrl);
  }, [key, encode, initialValue, router, searchParams]);

  useEffect(() => {
    const urlValue = searchParams.get(key);
    if (urlValue !== null) {
      try {
        const decodedValue = decode(urlValue);
        if (decodedValue !== state) {
          setState(decodedValue);
        }
      } catch {
        // Keep current state if decode fails
      }
    } else if (state !== initialValue) {
      setState(initialValue);
    }
  }, [searchParams, key, decode, initialValue]);

  return [state, setValue];
}