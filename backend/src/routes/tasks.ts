import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Task } from '../models/Task';
import { AppError } from '../middleware/errorHandler';
import { validate } from '../middleware/validate';
import {
  createTaskSchema,
  updateTaskSchema,
  reorderSchema,
  CreateTaskDto,
  UpdateTaskDto,
  ReorderDto,
} from '../models/schemas';

export const tasksRouter = Router();

tasksRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query['dateKey']
      ? { dateKey: String(req.query['dateKey']) }
      : {};

    const tasks = await Task.find(filter).sort({ dateKey: 1, order: 1 }).lean();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

tasksRouter.post(
  '/',
  validate(createTaskSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as CreateTaskDto;

      if (dto.order === undefined) {
        const count = await Task.countDocuments({ dateKey: dto.dateKey });
        dto.order = count;
      }

      const task = await Task.create(dto);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

tasksRouter.patch(
  '/:id',
  validate(updateTaskSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) throw new AppError(400, 'Invalid task ID');

      const dto = req.body as UpdateTaskDto;
      const updated = await Task.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true }).lean();

      if (!updated) throw new AppError(404, 'Task not found');
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

tasksRouter.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) throw new AppError(400, 'Invalid task ID');

      const deleted = await Task.findByIdAndDelete(id);
      if (!deleted) throw new AppError(404, 'Task not found');
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

tasksRouter.post(
  '/reorder',
  validate(reorderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tasks } = req.body as ReorderDto;

      const ops = tasks.map(({ _id, order, dateKey }) => ({
        updateOne: {
          filter: { _id: new Types.ObjectId(_id) },
          update: { $set: { order, dateKey } },
        },
      }));

      await Task.bulkWrite(ops);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);
