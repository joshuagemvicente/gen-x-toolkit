/** Outcome of a call that may fail, without exceptions crossing a boundary. */
export type Result<T> =
  | { readonly ok: true; readonly data: T }
  | { readonly ok: false; readonly message: string };

/**
 * Runs a loader and reports failure as data.
 *
 * Rendering reads better when the failure path is a value: no try/catch in the
 * middle of JSX, and an unreachable API renders an explicit state.
 */
export async function attempt<T>(load: () => Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "unknown error",
    };
  }
}
