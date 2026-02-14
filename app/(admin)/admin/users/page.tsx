"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { adminApi } from "@/lib/admin-api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('user');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.listUsers(1, 200);
      setUsers(data.users || []);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (!email || !password) return toast.error('Email and password required');
      await adminApi.createUser({ email, password, displayName, role });
      toast.success('User created');
      setEmail(''); setPassword(''); setDisplayName(''); setRole('user');
      loadUsers();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create user');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('User deleted');
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">Create, view and delete users</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input placeholder="Email" value={email} onChange={(e:any)=>setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e:any)=>setPassword(e.target.value)} />
            <Input placeholder="Display Name" value={displayName} onChange={(e:any)=>setDisplayName(e.target.value)} />
            <div className="flex gap-2">
              <select value={role} onChange={(e)=>setRole(e.target.value)} className="rounded-md border px-2">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Display</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(u => (
                    <TableRow key={u._id}>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.displayName || '-'}</TableCell>
                      <TableCell>{u.role}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="destructive" size="sm" onClick={()=>handleDelete(u._id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
