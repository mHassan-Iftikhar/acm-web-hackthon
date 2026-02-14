'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 text-balance">
          Welcome to Taakra
        </h1>
        <p className="text-lg text-slate-600 mt-2">
          Manage competitions and registrations in one place
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Competitions</CardTitle>
            <CardDescription>Running right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Registrations</CardTitle>
            <CardDescription>Competitions you joined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Messages</CardTitle>
            <CardDescription>From competition organizers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <p className="text-lg font-medium text-slate-900">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-slate-600">User ID</label>
            <p className="font-mono text-sm text-slate-500">{user?.uid}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
