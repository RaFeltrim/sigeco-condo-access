import { Response } from 'express';
import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth';

export class DashboardController {
  async getStats(req: AuthRequest, res: Response) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's visits
      const visitsToday = await prisma.visit.count({
        where: {
          entryTime: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      // Get active visitors
      const activeVisitors = await prisma.visit.count({
        where: {
          status: 'ATIVO',
        },
      });

      // Get week's visits
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const visitsWeek = await prisma.visit.count({
        where: {
          entryTime: {
            gte: weekAgo,
          },
        },
      });

      // Get pending appointments
      const pendingAppointments = await prisma.appointment.count({
        where: {
          status: 'PENDENTE',
        },
      });

      // Get total residents
      const totalResidents = await prisma.resident.count({
        where: {
          status: 'ATIVO',
        },
      });

      // Get recent visits
      const recentVisits = await prisma.visit.findMany({
        take: 10,
        orderBy: { entryTime: 'desc' },
        include: { unit: true },
      });

      res.json({
        stats: {
          visitsToday,
          activeVisitors,
          visitsWeek,
          pendingAppointments,
          totalResidents,
        },
        recentVisits,
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getReports(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate, type } = req.query;

      const where = {
        entryTime: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      };

      const visits = await prisma.visit.findMany({
        where,
        include: { unit: true },
        orderBy: { entryTime: 'desc' },
      });

      res.json({ visits, type });
    } catch (error) {
      logger.error('Get reports error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
