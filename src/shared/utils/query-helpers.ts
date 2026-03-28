import { toast } from 'sonner'

export function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function createMutationErrorHandler(fallbackMessage: string) {
  return (error: unknown) => {
    toast.error(getErrorMessage(error, fallbackMessage))
  }
}
