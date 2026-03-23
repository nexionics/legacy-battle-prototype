import { useSyncExternalStore, useRef, useCallback } from 'react';

class CountdownStore {
  private seconds: number = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private listeners = new Set<() => void>();

  constructor(initialSeconds: number) {
    this.seconds = initialSeconds;
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.stop();
      }
    };
  };

  getSnapshot = () => this.seconds;

  start = () => {
    if (this.interval) return;
    this.interval = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds -= 1;
        this.notify();
      } else {
        this.stop();
      }
    }, 1000);
  };

  stop = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  reset = (seconds: number) => {
    this.seconds = seconds;
    this.notify();
    this.start();
  };

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export function useCountdown(initialSeconds: number) {
  const storeRef = useRef<CountdownStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = new CountdownStore(initialSeconds);
    storeRef.current.start();
  }

  const seconds = useSyncExternalStore(
    storeRef.current.subscribe,
    storeRef.current.getSnapshot,
    storeRef.current.getSnapshot,
  );

  const reset = useCallback((newSeconds: number) => {
    storeRef.current?.reset(newSeconds);
  }, []);

  return {
    seconds,
    canResend: seconds === 0,
    reset,
  };
}
