export const generatorKeys = {
  all: ['generator'] as const,
  conversations: () => [...generatorKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...generatorKeys.all, 'conversation', id] as const,
}