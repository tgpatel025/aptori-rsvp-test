export const RedisKeys = {
  events: (userId: string) => `events:${userId}`,
  event: (id: string) => `event:${id}`,
};
