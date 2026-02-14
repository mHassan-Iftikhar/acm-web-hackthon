import User, { IUser } from '../../models/User.js';

export class AuthService {
  /**
   * Find or create a user after Firebase authentication
   * Called when user logs in for the first time
   */
  async findOrCreateUser(
    firebaseUID: string,
    email: string,
    displayName?: string
  ): Promise<IUser> {
    try {
      // Try to find existing user
      let user = await User.findOne({ firebaseUID });

      if (user) {
        // Update displayName if provided and different
        if (displayName && user.displayName !== displayName) {
          user.displayName = displayName;
          await user.save();
        }
        return user;
      }

      // Create new user if doesn't exist
      user = new User({
        firebaseUID,
        email,
        displayName: displayName || null,
        role: 'user',
      });

      await user.save();

      console.log(`✅ New user created: ${email}`);
      return user;
    } catch (error) {
      console.error('Error in findOrCreateUser:', error);
      throw error;
    }
  }

  /**
   * Get user by Firebase UID
   */
  async getUserByUID(firebaseUID: string): Promise<IUser | null> {
    try {
      return await User.findOne({ firebaseUID });
    } catch (error) {
      console.error('Error getting user by UID:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUser(
    firebaseUID: string,
    updateData: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate({ firebaseUID }, updateData, {
        new: true,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async deleteUser(firebaseUID: string): Promise<boolean> {
    try {
      const result = await User.findOneAndDelete({ firebaseUID });
      return result !== null;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}

export default new AuthService();
