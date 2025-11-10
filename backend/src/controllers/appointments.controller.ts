import { Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';

export class AppointmentsController {
  async getAll(req: AuthRequest, res: Response) {
    try {
      const { status, date, residentId } = req.query;

      const where = {
        ...(status && { status: status as string }),
        ...(date && { scheduledDate: new Date(date as string) }),
        ...(residentId && { residentId: residentId as string }),
      };

      const appointments = await prisma.appointment.findMany({
        where,
        include: {
          resident: { include: { unit: true } },
          unit: true,
        },
        orderBy: { scheduledDate: 'desc' },
      });

      res.json({ appointments });
    } catch (error) {
      logger.error('Get appointments error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      const {
        visitorName,
        visitorDoc,
        visitorPhone,
        destination,
        reason,
        scheduledDate,
        scheduledTime,
        observations,
        residentId,
        unitId,
      } = req.body;

      const appointment = await prisma.appointment.create({
        data: {
          visitorName,
          visitorDoc,
          visitorPhone,
          destination,
          reason,
          scheduledDate: new Date(scheduledDate),
          scheduledTime,
          observations,
          residentId,
          unitId,
        },
        include: {
          resident: true,
          unit: true,
        },
      });

      logger.info(`Appointment created for ${visitorName}`);
      res.status(201).json({ appointment });
    } catch (error) {
      logger.error('Create appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, observations } = req.body;

      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(observations && { observations }),
        },
        include: {
          resident: true,
          unit: true,
        },
      });

      logger.info(`Appointment ${id} updated to ${status}`);
      res.json({ appointment });
    } catch (error) {
      logger.error('Update appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.appointment.delete({
        where: { id },
      });

      logger.info(`Appointment ${id} deleted`);
      res.json({ message: 'Appointment deleted successfully' });
    } catch (error) {
      logger.error('Delete appointment error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
