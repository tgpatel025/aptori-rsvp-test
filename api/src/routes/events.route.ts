import { Router } from 'express';
import { create, get, list, remove, update, updateRsvp } from '../controllers/events.controller';
import { catchAsync } from '../errors/catch-async';

const router = Router();

router.get('/', catchAsync(list));

router.get('/:id', catchAsync(get));

router.post('/', catchAsync(create));

router.patch('/:id', catchAsync(update));

router.delete('/:id', catchAsync(remove));

router.patch('/:id/rsvp/:response', catchAsync(updateRsvp));

export default router;
