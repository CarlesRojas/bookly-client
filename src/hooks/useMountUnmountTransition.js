import { useState, useEffect } from "react";

export default function useMountUnmountTransition(isMounted, unmountDelay) {
    const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

    useEffect(() => {
        let timeoutId;

        if (isMounted && !hasTransitionedIn) {
            setHasTransitionedIn(true);
        } else if (!isMounted && hasTransitionedIn) {
            timeoutId = setTimeout(() => setHasTransitionedIn(false), unmountDelay);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [unmountDelay, isMounted, hasTransitionedIn]);

    return hasTransitionedIn;
}

/* EXAMPLE

const Example = () => {
  const [isMounted, setIsMounted] = useState(false);
  const hasTransitionedIn = useMountTransition(isMounted, 1000);

  return (
    <div className="container">
      <button onClick={() => setIsMounted(!isMounted)}>
        {`${isMounted ? 'Hide' : 'Show'} Element`}
      </button>

      <div className="content">
        {(hasTransitionedIn || isMounted) && (
          <div
            className={`card ${hasTransitionedIn && 'in'} ${isMounted && 'visible'}`}
          >
            Card Content
          </div>
        )}
      </div>
    </div>
  );
};

// The styles are applied only if both "in" and "visible" classes are on the div element.
.card.in.visible {
  opacity: 1;
  transform: translateY(0);
}


https://letsbuildui.dev/articles/how-to-animate-mounting-content-in-react
*/
