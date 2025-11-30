import { Prisma } from '@prisma/client';
import { v4 } from 'uuid';
import z from 'zod';
import ApiError from '../errors/api-error';
import prisma from '../lib/prisma';
import {
  GetEventResponseSchema,
  ListEventsResponseSchema,
  PatchEventRequestBodySchema,
  PatchEventResponseSchema,
  PatchEventRSVPResponseSchema,
  PostEventRequestBodySchema,
  PostEventResponseSchema,
} from '../parsers/events.parser';
import { RedisKeys } from '../utils/redis-keys';
import { redisService } from './redis.service';

const eventsSelect = {
  id: true,
  name: true,
  description: true,
  location: true,
  time: true,
  userId: true,
  rsvps: {
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      response: true,
    },
  },
} satisfies Prisma.EventsSelect;

export async function list(userId: string): Promise<z.input<typeof ListEventsResponseSchema>> {
  const cache = await redisService.get<z.input<typeof ListEventsResponseSchema>>(RedisKeys.events(userId));
  if (cache) return cache;

  const created = await prisma.events.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    select: eventsSelect,
  });

  const invited = await prisma.events.findMany({
    where: {
      deletedAt: null,
      rsvps: {
        every: {
          userId,
          deletedAt: null,
        },
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      time: true,
      userId: true,
    },
  });

  const data = {
    created,
    invited,
  };

  await redisService.set<z.input<typeof ListEventsResponseSchema>>(RedisKeys.events(userId), data);

  return data;
}

export async function get(id: string, userId: string): Promise<z.input<typeof GetEventResponseSchema>> {
  const cache = await redisService.get<z.input<typeof GetEventResponseSchema>>(RedisKeys.event(id));
  if (cache) return cache;

  const event = await prisma.events.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: eventsSelect,
  });

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.userId !== userId) {
    throw new ApiError(403, 'Insufficient Priviledges');
  }

  await redisService.set<z.input<typeof GetEventResponseSchema>>(RedisKeys.event(id), event);
  await redisService.del(RedisKeys.events(userId));

  return event;
}

export async function create(
  payload: z.infer<typeof PostEventRequestBodySchema>,
  userId: string
): Promise<z.input<typeof PostEventResponseSchema>> {
  const { invitees, ...rest } = payload;
  const id = v4();

  const createEventTask = prisma.events.create({
    data: {
      id,
      userId,
      ...rest,
    },
    select: eventsSelect,
  });

  const createRsvpsTask = prisma.rSVPs.createMany({
    data: invitees.map((userId) => ({
      eventId: id,
      userId,
      response: null,
    })),
  });

  const [created] = await prisma.$transaction([createEventTask, createRsvpsTask]);

  await redisService.set<z.input<typeof PostEventResponseSchema>>(RedisKeys.event(id), created);
  await redisService.del(RedisKeys.events(userId));

  return created;
}

export async function update(
  id: string,
  payload: z.infer<typeof PatchEventRequestBodySchema>,
  userId: string
): Promise<z.input<typeof PatchEventResponseSchema>> {
  const { userIdToAdd, userIdsToRemove, ...rest } = payload;

  const event = await prisma.events.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: eventsSelect,
  });

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.userId !== userId) {
    throw new ApiError(403, 'Insufficient Priviledges');
  }

  const updatedEvent = await prisma.$transaction(async (tx) => {
    await tx.rSVPs.updateMany({
      data: {
        deletedAt: new Date(),
      },
      where: {
        userId,
        eventId: id,
        id: {
          in: userIdsToRemove,
        },
      },
    });

    await tx.rSVPs.createMany({
      data: userIdToAdd.map((userId) => ({
        eventId: id,
        userId,
        response: null,
      })),
    });

    const event = await tx.events.update({
      data: rest,
      where: {
        id,
        deletedAt: null,
      },
      select: eventsSelect,
    });

    return event;
  });

  await redisService.set<z.input<typeof PatchEventResponseSchema>>(RedisKeys.event(id), updatedEvent);
  await redisService.del(RedisKeys.events(userId));

  return updatedEvent;
}

export async function remove(id: string, userId: string): Promise<void> {
  const event = await prisma.events.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.userId !== userId) {
    throw new ApiError(403, 'Insufficient Priviledges');
  }

  await prisma.events.update({
    data: {
      deletedAt: new Date(),
    },
    where: {
      id,
      deletedAt: null,
    },
  });

  await redisService.del(RedisKeys.event(id));
  await redisService.del(RedisKeys.events(userId));
}

export async function updateRsvp(
  id: string,
  response: string,
  userId: string
): Promise<z.input<typeof PatchEventRSVPResponseSchema>> {
  const event = await prisma.events.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: eventsSelect,
  });

  if (!event) {
    throw new ApiError(404, 'Event not exists');
  }

  const { rsvps, ...rest } = event;

  const rsvp = rsvps.find((rsvp) => rsvp.userId === userId);

  if (!rsvp) {
    throw new ApiError(403, 'Insufficient Priviledges');
  }

  await prisma.rSVPs.update({
    data: {
      response,
    },
    where: {
      id: rsvp.id,
    },
  });

  await redisService.del(RedisKeys.event(id));
  await redisService.del(RedisKeys.events(userId));

  return rest;
}
