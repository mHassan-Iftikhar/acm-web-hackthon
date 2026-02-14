import { Request, Response } from 'express';
import discoveryService from './discovery.service.js';

class DiscoveryController {
    /**
     * GET /api/competitions/discover/trending
     * Get trending competitions
     */
    async getTrending(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const competitions = await discoveryService.getTrending(limit);

            res.status(200).json({
                status: 'success',
                data: competitions
            });
        } catch (error) {
            console.error('Get trending error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch trending competitions'
            });
        }
    }

    /**
     * GET /api/competitions/discover/popular
     * Get most registered competitions
     */
    async getPopular(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const competitions = await discoveryService.getMostRegistered(limit);

            res.status(200).json({
                status: 'success',
                data: competitions
            });
        } catch (error) {
            console.error('Get popular error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch popular competitions'
            });
        }
    }

    /**
     * GET /api/competitions/discover/new
     * Get newly created competitions
     */
    async getNew(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const days = parseInt(req.query.days as string) || 14;
            const competitions = await discoveryService.getNew(limit, days);

            res.status(200).json({
                status: 'success',
                data: competitions
            });
        } catch (error) {
            console.error('Get new competitions error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch new competitions'
            });
        }
    }

    /**
     * GET /api/competitions/discover/upcoming
     * Get upcoming competitions
     */
    async getUpcoming(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const days = parseInt(req.query.days as string) || 30;
            const competitions = await discoveryService.getUpcoming(limit, days);

            res.status(200).json({
                status: 'success',
                data: competitions
            });
        } catch (error) {
            console.error('Get upcoming competitions error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch upcoming competitions'
            });
        }
    }

    /**
     * GET /api/competitions/discover/calendar
     * Get calendar view data
     * Query params: year, month
     */
    async getCalendar(req: Request, res: Response) {
        try {
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;

            const calendarData = await discoveryService.getCalendarView(year, month);

            res.status(200).json({
                status: 'success',
                data: calendarData
            });
        } catch (error) {
            console.error('Get calendar error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch calendar data'
            });
        }
    }

    /**
     * GET /api/competitions/discover/agenda
     * Get agenda list grouped by date
     */
    async getAgenda(req: Request, res: Response) {
        try {
            const days = parseInt(req.query.days as string) || 90;
            const agendaData = await discoveryService.getAgenda(days);

            res.status(200).json({
                status: 'success',
                data: agendaData
            });
        } catch (error) {
            console.error('Get agenda error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to fetch agenda'
            });
        }
    }
}

export default new DiscoveryController();
