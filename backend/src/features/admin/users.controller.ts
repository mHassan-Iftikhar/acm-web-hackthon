import { Request, Response } from 'express';
import User from '../../models/User.js';
import { auth } from '../../config/firebase-admin.js';

// GET /api/admin/users
export async function listUsers(req: Request, res: Response) {
  try {
    const { page = '1', limit = '50' } = req.query as any;
    const p = parseInt(page, 10) || 1;
    const l = Math.min(parseInt(limit, 10) || 50, 500);

    const [users, total] = await Promise.all([
      User.find()
        .select('firebaseUID email displayName role createdAt')
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l)
        .lean(),
      User.countDocuments(),
    ]);

    res.status(200).json({ status: 'success', data: { users, total, page: p, limit: l } });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message || 'Failed to list users' });
  }
}

// POST /api/admin/users
// Body: { email, password, displayName?, role? }
export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, displayName = '', role = 'user' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    // Create Firebase user
    const firebaseUser = await auth.createUser({ email, password, displayName });

    // Create Mongo User record
    const user = new User({ firebaseUID: firebaseUser.uid, email: firebaseUser.email, displayName, role });
    await user.save();

    res.status(201).json({ status: 'success', data: { uid: firebaseUser.uid, email: firebaseUser.email, role } });
  } catch (err: any) {
    // If firebase already has user, return appropriate message
    res.status(500).json({ status: 'error', message: err.message || 'Failed to create user' });
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    // Delete from Firebase (best-effort)
    try {
      if (user.firebaseUID) {
        await auth.deleteUser(user.firebaseUID);
      }
    } catch (e) {
      // log but continue to remove from mongo
      console.warn('Failed to delete firebase user:', e instanceof Error ? e.message : e);
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ status: 'success', message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', message: err.message || 'Failed to delete user' });
  }
}

export default { listUsers, createUser, deleteUser };
