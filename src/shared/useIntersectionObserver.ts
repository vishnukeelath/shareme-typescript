import { DependencyList, useCallback, useRef } from "react";

export default function useIntersectionObserver<T extends HTMLElement>(
  callback: () => void,
  deps: DependencyList
) {
  const observer = useRef<IntersectionObserver | null>(null);
  console.log("observer.current", observer.current);
  const ref = useCallback(
    (node: T) => {
      console.log("entered observer callback fn");
      if (observer.current) observer.current.disconnect();
      if (deps.every(Boolean)) {
        // observer.current?.disconnect();
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) callback();
        });
        console.log("new observer.current", observer.current);
        if (node) observer.current.observe(node);
      }
    },
    [deps, callback]
  );
  return ref;
}
