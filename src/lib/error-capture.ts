type CapturedError = {
  error: unknown;
  at: number;
};

let lastCapturedError: CapturedError | undefined;
const TTL_MS = 5_000;

function record(error: unknown) {
  // Always normalize to avoid weird event shapes
  lastCapturedError = {
    error: error instanceof Error ? error : new Error(String(error)),
    at: Date.now(),
  };
}

function isBrowserErrorEvent(
  event: Event,
): event is ErrorEvent {
  return "error" in event;
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event: Event) => {
    const err = isBrowserErrorEvent(event)
      ? event.error ?? event
      : event;

    record(err);
  });

  globalThis.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      record(event.reason);
    },
  );
}

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;

  // TTL cleanup
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }

  const { error } = lastCapturedError;
  lastCapturedError = undefined;

  return error;
}