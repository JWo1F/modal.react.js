export const createPromise = <T>() => {
  type Resolve = (value: (T | PromiseLike<T>)) => void;

  let resolve: Resolve | null = null;

  const promise = new Promise<T>((res) => {
    resolve = res;
  });

  return [
    resolve as unknown as Resolve,
    promise
  ] as const;
};