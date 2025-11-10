import { Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';

export class VisitsController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { status, unitId, date } = req.query;

      const where = {
        ...(status && { status: status as string }),
        ...(unitId && { unitId: unitId as string }),
        ...(date && {
          entryTime: {
            gte: new Date(date as string),
            lt: new Date(new Date(date as string).getTime() + 24 * 60 * 60 * 1000),
          },
        }),
      };

      const visits = await prisma.visit.findMany({
        where,
        include: { unit: true },
        orderBy: { entryTime: 'desc' },
      });

      res.json({ visits });
    } catch (error) {
      logger.error('Get visits error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const { visitorName, document, unitId, purpose, photo } = req.body;

      const visit = await prisma.visit.create({
        data: {
          visitorName,
          document,
          unitId,
          purpose,
          photo,
        },
        include: { unit: true },
      });

      logger.info(`Visit registered: ${visitorName}`);
      res.status(201).json({ visit });
    } catch (error) {
      logger.error('Create visit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async checkOut(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const visit = await prisma.visit.update({
        where: { id },
        data: {
          exitTime: new Date(),
          status: 'SAIU',
        },
        include: { unit: true },
      });

      logger.info(`Visit checked out: ${visit.visitorName}`);
      res.json({ visit });
    } catch (error) {
      logger.error('Check out visit error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
