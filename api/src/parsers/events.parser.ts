import { z } from 'zod';

const EventIdSchema = z.object({
  id: z.uuid().meta({ description: 'Event id' }),
});

export const GetEventRequestSchema = z.object({
  params: EventIdSchema,
});

const RSVPSchema = z.object({
  id: z.uuid().meta({ description: 'Invitation id' }),
  userId: z.string().max(36).meta({ description: 'Invited user id' }),
  response: z.string().nullable(),
});

const EventSchema = z.object({
  id: z.uuid().meta({ description: 'Event id' }),
  name: z.string().max(100).meta({ description: 'Event name' }),
  description: z.string().max(1000).nullable().meta({ description: 'Event description' }),
  location: z.string().meta({ description: 'Event location' }),
  time: z
    .date()
    .transform((date) => date.toISOString())
    .meta({ description: 'Event time' }),
  userId: z.string().max(36).meta({ description: 'Id of user who created event' }),
  rsvps: z.array(RSVPSchema).meta({ description: 'List of RSVPs with this Event' }),
});

export const GetEventResponseSchema = EventSchema;

export const ListEventsResponseSchema = z.object({
  invited: z.array(EventSchema.omit({ rsvps: true })).meta({ description: 'Invited events list' }),
  created: z.array(EventSchema).meta({ description: 'Created events list' }),
});

export const PostEventRequestBodySchema = z.object({
  name: z.string().max(100).meta({ description: 'Event name' }),
  description: z.string().max(1000).nullable().meta({ description: 'Event description' }),
  location: z.string().meta({ description: 'Event location' }),
  time: z
    .date()
    .transform((date) => date.toISOString())
    .meta({ description: 'Event time' }),
  invitees: z.array(z.string()).meta({ description: 'List of invitees' }),
});

export const PostEventRequestSchema = z.object({
  body: PostEventRequestBodySchema,
});

export const PostEventResponseSchema = EventSchema;

export const PatchEventRequestBodySchema = z.object({
  name: z.string().max(100).meta({ description: 'Event name' }),
  description: z.string().max(1000).nullable().meta({ description: 'Event description' }),
  location: z.string().meta({ description: 'Event location' }),
  time: z
    .date()
    .transform((date) => date.toISOString())
    .meta({ description: 'Event time' }),
  userIdsToRemove: z.array(z.string().max(36)).meta({ description: 'Remove users from RSVPs' }),
  userIdToAdd: z.array(z.string().max(36)).meta({ description: 'Add users to RSVPs' }),
});

export const PatchEventRequestSchema = z.object({
  params: EventIdSchema,
  body: PatchEventRequestBodySchema,
});

export const PatchEventResponseSchema = EventSchema;

export const DeleteEventRequestSchema = z.object({
  params: EventIdSchema,
});

export const PatchEventRSVPRequestSchema = z.object({
  params: z.object({
    id: z.uuid().meta({ description: 'Event id' }),
    response: z.enum(['YES', 'NO', 'MAYBE']).meta({ description: 'Event response' }),
  }),
});

export const PatchEventRSVPResponseSchema = EventSchema.omit({ rsvps: true });
