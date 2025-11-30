import { Request, Response } from 'express';
import z from 'zod';
import ApiError from '../errors/api-error';
import {
  DeleteEventRequestSchema,
  GetEventRequestSchema,
  GetEventResponseSchema,
  ListEventsResponseSchema,
  PatchEventRequestSchema,
  PatchEventResponseSchema,
  PatchEventRSVPRequestSchema,
  PatchEventRSVPResponseSchema,
  PostEventRequestSchema,
  PostEventResponseSchema,
} from '../parsers/events.parser';
import * as eventsService from '../services/events.service';

export async function list(request: Request, response: Response<z.output<typeof ListEventsResponseSchema>>) {
  if (request.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId } = request.user;
  const data = await eventsService.list(userId);
  const parsedData = ListEventsResponseSchema.parse(data);
  return response.status(200).json(parsedData);
}

export async function get(
  request: Request<z.input<typeof GetEventRequestSchema>>,
  response: Response<z.output<typeof GetEventResponseSchema>>
) {
  if (request.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId } = request.user;
  const { params } = GetEventRequestSchema.parse(request);
  const data = await eventsService.get(params.id, userId);
  const parsedData = GetEventResponseSchema.parse(data);
  return response.status(200).json(parsedData);
}

export async function create(
  request: Request<z.input<typeof PostEventRequestSchema>>,
  response: Response<z.output<typeof PostEventResponseSchema>>
) {
  if (request.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId } = request.user;
  const { body } = PostEventRequestSchema.parse(request);
  const data = await eventsService.create(body, userId);
  const parsedData = PostEventResponseSchema.parse(data);
  return response.status(200).json(parsedData);
}

export async function update(
  request: Request<z.input<typeof PatchEventRequestSchema>>,
  response: Response<z.output<typeof PatchEventResponseSchema>>
) {
  const { id: userId } = request.user;
  const { body, params } = PatchEventRequestSchema.parse(request);
  const data = await eventsService.update(params.id, body, userId);
  const parsedData = PatchEventResponseSchema.parse(data);
  return response.status(200).json(parsedData);
}

export async function remove(request: Request<z.input<typeof DeleteEventRequestSchema>>, response: Response) {
  if (request.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId } = request.user;
  const { params } = DeleteEventRequestSchema.parse(request);
  await eventsService.remove(params.id, userId);
  return response.status(204).send();
}

export async function updateRsvp(
  request: Request<z.input<typeof PatchEventRSVPRequestSchema>>,
  response: Response<z.output<typeof PatchEventRSVPResponseSchema>>
) {
  if (request.user) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { id: userId } = request.user;
  const { params } = PatchEventRSVPRequestSchema.parse(request);
  const data = await eventsService.updateRsvp(params.id, params.response, userId);
  const parsedData = PatchEventRSVPResponseSchema.parse(data);
  return response.status(200).json(parsedData);
}
