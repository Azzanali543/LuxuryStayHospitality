import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router does not automatically reset the document scroll position
 * when navigating between SPA routes. Keep the browser from restoring the
 * previous position and explicitly reset it after every route change.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    let cancelled = false;

    const scrollToRoute = () => {
      if (cancelled) return;

      if (hash) {
        const id = decodeURIComponent(hash.slice(1));
        const element = document.getElementById(id);

        if (element) {
          element.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
      }

      // Reset both the document and common scroll containers.
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Wait one frame so the newly-rendered route is in the DOM.
    const frame = window.requestAnimationFrame(scrollToRoute);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, hash]);

  return null;
}
