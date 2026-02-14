'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Competition {
    _id: string;
    title: string;
    shortDescription: string;
    startDate: string;
    venue: string;
    category: {
        name: string;
        icon: string;
        color: string;
    };
    status: string;
}

interface AgendaGroup {
    date: string;
    competitions: Competition[];
}

interface AgendaListProps {
    days?: number;
}

export function AgendaList({ days = 30 }: AgendaListProps) {
    const [agendaData, setAgendaData] = useState<AgendaGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAgenda();
    }, [days]);

    const fetchAgenda = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/competitions/discover/agenda?days=${days}`);
            setAgendaData(response.data.data);
        } catch (error) {
            console.error('Failed to fetch agenda:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="py-6">
                    <div className="text-center text-sm text-muted-foreground">Loading agenda...</div>
                </CardContent>
            </Card>
        );
    }

    if (agendaData.length === 0) {
        return (
            <Card>
                <CardContent className="py-6">
                    <div className="text-center text-sm text-muted-foreground">
                        No competitions scheduled in the next {days} days
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Upcoming Agenda</h3>
            <div className="space-y-6">
                {agendaData.map((group) => {
                    const dateObj = parseISO(group.date);
                    const formattedDate = format(dateObj, 'EEE, MMM d');
                    const isToday = format(new Date(), 'yyyy-MM-dd') === group.date;

                    return (
                        <div key={group.date} className="space-y-2">
                            <div className="flex items-center gap-2 sticky top-0 bg-background z-10 py-2">
                                <Calendar className="h-4 w-4" />
                                <h4 className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                                    {formattedDate}
                                    {isToday && ' (Today)'}
                                </h4>
                            </div>
                            <div className="space-y-2 pl-6 border-l-2 border-muted">
                                {group.competitions.map((competition) => (
                                    <Link key={competition._id} href={`/competitions/${competition._id}`}>
                                        <Card className="hover:bg-accent transition-colors cursor-pointer">
                                            <CardContent className="p-3">
                                                <div className="flex items-start gap-2">
                                                    <div className="text-xl">{competition.category.icon}</div>
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="text-sm font-medium truncate">{competition.title}</h5>
                                                        {competition.shortDescription && (
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {competition.shortDescription}
                                                            </p>
                                                        )}
                                                        {competition.venue && (
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                                                                <MapPin className="h-3 w-3" />
                                                                <span className="truncate">{competition.venue}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Badge variant="outline" className="shrink-0 text-xs">
                                                        {competition.category.name}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
