import * as React from "react";

/**
 * Simulates a brief fetch delay so pages can demonstrate loading skeletons.
 * Swap this out for real query/fetch state once wired to an API.
 */
export function useSimulatedLoading(delayMs = 700) {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return isLoading;
}
