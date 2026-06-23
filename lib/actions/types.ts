export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; mock?: boolean }

export function actionError(message: string, mock = false): ActionResult<never> {
  return { ok: false as const, error: message, mock }
}

export function actionOk<T>(data: T): ActionResult<T> {
  return { ok: true as const, data }
}

export function isActionFailure<T>(
  result: ActionResult<T>
): result is { ok: false; error: string; mock?: boolean } {
  return result.ok === false
}
