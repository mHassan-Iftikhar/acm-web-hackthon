import Competition from '../../models/Competition.js';
import { startOfDay, subDays } from 'date-fns';

class DiscoveryService {
    /**
     * Get most registered competitions
     * @param limit - Number of competitions to return
     */
    async getMostRegistered(limit: number = 10) {
        return await Competition.find({ status: { $in: ['registration_open', 'ongoing'] } })
            .sort({ registeredCount: -1 })
            .limit(limit)
            .populate('category', 'name icon color')
            .populate('organizer', 'displayName');
    }

    /**
     * Get trending competitions based on registration velocity
     * Trending algorithm: competitions with most registrations in last 7 days
     * @param limit - Number of competitions to return
     */
    async getTrending(limit: number = 10) {
        const sevenDaysAgo = subDays(new Date(), 7);

        // Aggregate registrations from last 7 days
        const pipeline = [
            {
                $match: {
                    status: { $in: ['registration_open', 'ongoing'] },
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $lookup: {
                    from: 'registrations',
                    localField: '_id',
                    foreignField: 'competition',
                    as: 'recentRegistrations'
                }
            },
            {
                $addFields: {
                    recentRegistrationCount: {
                        $size: {
                            $filter: {
                                input: '$recentRegistrations',
                                as: 'reg',
                                cond: { $gte: ['$$reg.createdAt', sevenDaysAgo] }
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    recentRegistrationCount: { $gt: 0 }
                }
            },
            { $sort: { recentRegistrationCount: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'organizer',
                    foreignField: '_id',
                    as: 'organizer'
                }
            },
            { $unwind: '$category' },
            { $unwind: '$organizer' },
            {
                $project: {
                    title: 1,
                    shortDescription: 1,
                    description: 1,
                    startDate: 1,
                    endDate: 1,
                    registrationDeadline: 1,
                    bannerUrl: 1,
                    venue: 1,
                    maxParticipants: 1,
                    registeredCount: 1,
                    entryFee: 1,
                    status: 1,
                    'category.name': 1,
                    'category.icon': 1,
                    'category.color': 1,
                    'organizer.displayName': 1,
                    recentRegistrationCount: 1
                }
            }
        ];

        return await Competition.aggregate(pipeline);
    }

    /**
     * Get newly created competitions
     * @param limit - Number of competitions to return
     * @param days - Number of days to look back (default: 14)
     */
    async getNew(limit: number = 10, days: number = 14) {
        const cutoffDate = subDays(new Date(), days);

        return await Competition.find({
            createdAt: { $gte: cutoffDate },
            status: { $in: ['registration_open', 'draft'] }
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('category', 'name icon color')
            .populate('organizer', 'displayName');
    }

    /**
     * Get upcoming competitions (starting soon)
     * @param limit - Number of competitions to return
     * @param days - Number of days ahead to look (default: 30)
     */
    async getUpcoming(limit: number = 10, days: number = 30) {
        const today = startOfDay(new Date());
        const futureDate = subDays(today, -days);

        return await Competition.find({
            startDate: { $gte: today, $lte: futureDate },
            status: { $in: ['registration_open', 'registration_closed'] }
        })
            .sort({ startDate: 1 })
            .limit(limit)
            .populate('category', 'name icon color')
            .populate('organizer', 'displayName');
    }

    /**
     * Get calendar view data for a specific month
     * @param year - Year
     * @param month - Month (1-12)
     */
    async getCalendarView(year: number, month: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const competitions = await Competition.find({
            $or: [
                { startDate: { $gte: startDate, $lte: endDate } },
                { endDate: { $gte: startDate, $lte: endDate } },
                {
                    startDate: { $lte: startDate },
                    endDate: { $gte: endDate }
                }
            ]
        })
            .sort({ startDate: 1 })
            .populate('category', 'name icon color')
            .select('title startDate endDate category status venue');

        // Group by date
        const groupedByDate: { [key: string]: any[] } = {};

        competitions.forEach((comp) => {
            const dateKey = comp.startDate.toISOString().split('T')[0];
            if (!groupedByDate[dateKey]) {
                groupedByDate[dateKey] = [];
            }
            groupedByDate[dateKey].push(comp);
        });

        return groupedByDate;
    }

    /**
     * Get agenda list (chronological competitions grouped by date)
     * @param days - Number of days ahead to fetch (default: 90)
     */
    async getAgenda(days: number = 90) {
        const today = startOfDay(new Date());
        const futureDate = subDays(today, -days);

        const competitions = await Competition.find({
            startDate: { $gte: today, $lte: futureDate }
        })
            .sort({ startDate: 1 })
            .populate('category', 'name icon color')
            .populate('organizer', 'displayName');

        // Group by date
        const groupedByDate: { date: string; competitions: any[] }[] = [];
        const dateMap: { [key: string]: any[] } = {};

        competitions.forEach((comp) => {
            const dateKey = comp.startDate.toISOString().split('T')[0];
            if (!dateMap[dateKey]) {
                dateMap[dateKey] = [];
            }
            dateMap[dateKey].push(comp);
        });

        // Convert to array format
        Object.keys(dateMap).sort().forEach((date) => {
            groupedByDate.push({
                date,
                competitions: dateMap[date]
            });
        });

        return groupedByDate;
    }
}

export default new DiscoveryService();
