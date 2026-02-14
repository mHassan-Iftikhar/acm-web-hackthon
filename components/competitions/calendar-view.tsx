'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Competition {
    _id: string;
    title: string;
    startDate: string;
    endDate: string;
    category: {
        name: string;
        icon: string;
        color: string;
    };
    status: string;
    venue: string;
}

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState<{ [key: string]: Competition[] }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalendarData();
    }, [currentDate]);

    const fetchCalendarData = async () => {
        setLoading(true);
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const response = await axios.get(
                `${API_URL}/api/competitions/discover/calendar?year=${year}&month=${month}`
            );
            setCalendarData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch calendar:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getCompetitionsForDate = (day: number): Competition[] => {
        const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return calendarData[dateKey] || [];
    };

    const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: startingDayOfWeek }, (_, i) => i);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">{monthYear}</CardTitle>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="text-xs font-semibold text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {blanks.map((blank) => (
                        <div key={`blank-${blank}`} className="aspect-square p-1" />
                    ))}
                    {days.map((day) => {
                        const competitions = getCompetitionsForDate(day);
                        const hasCompetitions = competitions.length > 0;

                        return (
                            <div
                                key={day}
                                className={`aspect-square p-1 border rounded-md relative ${hasCompetitions ? 'bg-primary/5 border-primary/20' : 'bg-muted/10'
                                    }`}
                            >
                                <div className="text-xs font-medium text-center">{day}</div>
                                {hasCompetitions && (
                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                        <Badge variant="secondary" className="h-1.5 w-1.5 p-0 rounded-full" />
                                    </div>
                                )}
                                {competitions.length > 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-background/90 rounded-md p-1 text-[10px] leading-tight transition-opacity">
                                        <div className="overflow-hidden">
                                            {competitions.slice(0, 2).map((comp) => (
                                                <div key={comp._id} className="truncate">
                                                    {comp.category.icon} {comp.title}
                                                </div>
                                            ))}
                                            {competitions.length > 2 && (
                                                <div className="text-muted-foreground">+{competitions.length - 2} more</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {loading && (
                    <div className="text-center py-4 text-sm text-muted-foreground">Loading calendar...</div>
                )}
            </CardContent>
        </Card>
    );
}
