import { Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';

export class ResidentsController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { unitId, status, search } = req.query;

      const where = {
        ...(unitId && { unitId: unitId as string }),
        ...(status && { status: status as string }),
        ...(search && {
          OR: [
            { name: { contains: search as string, mode: 'insensitive' as const } },
            { email: { contains: search as string, mode: 'insensitive' as const } },
            { document: { contains: search as string } },
          ],
        }),
      };

      const residents = await prisma.resident.findMany({
        where,
        include: {
          unit: true,
        },
        orderBy: { name: 'asc' },
      });

      res.json({ residents });
    } catch (error) {
      logger.error('Get residents error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const resident = await prisma.resident.findUnique({
        where: { id },
        include: {
          unit: true,
          appointments: {
            orderBy: { scheduledDate: 'desc' },
            take: 10,
          },
        },
      });

      if (!resident) {
        return res.status(404).json({ error: 'Resident not found' });
      }

      res.json({ resident });
    } catch (error) {
      logger.error('Get resident error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, email, phone, document, type, unitId } = req.body;

      const resident = await prisma.resident.create({
        data: {
          name,
          email,
          phone,
          document,
          type,
          unitId,
        },
        include: {
          unit: true,
        },
      });

      // Log action
      await prisma.accessLog.create({
        data: {
          userId: req.user!.id,
          action: 'CREATE_RESIDENT',
          resource: 'RESIDENTS',
          details: `Created resident: ${resident.name}`,
        },
      });

      logger.info(`Resident created: ${resident.name}`);
      res.status(201).json({ resident });
    } catch (error) {
      logger.error('Create resident error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { name, email, phone, document, type, status, unitId } = req.body;

      const resident = await prisma.resident.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(document && { document }),
          ...(type && { type }),
          ...(status && { status }),
          ...(unitId && { unitId }),
        },
        include: {
          unit: true,
        },
      });

      // Log action
      await prisma.accessLog.create({
        data: {
          userId: req.user!.id,
          action: 'UPDATE_RESIDENT',
          resource: 'RESIDENTS',
          details: `Updated resident: ${resident.name}`,
        },
      });

      logger.info(`Resident updated: ${resident.name}`);
      res.json({ resident });
    } catch (error) {
      logger.error('Update resident error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const resident = await prisma.resident.delete({
        where: { id },
      });

      // Log action
      await prisma.accessLog.create({
        data: {
          userId: req.user!.id,
          action: 'DELETE_RESIDENT',
          resource: 'RESIDENTS',
          details: `Deleted resident: ${resident.name}`,
        },
      });

      logger.info(`Resident deleted: ${resident.name}`);
      res.json({ message: 'Resident deleted successfully' });
    } catch (error) {
      logger.error('Delete resident error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
