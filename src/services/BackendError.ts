export interface BackendError {
  status: number
  message: string
  messageKey: string
}

export const throwError = (error: BackendError) => {
  throw error
}