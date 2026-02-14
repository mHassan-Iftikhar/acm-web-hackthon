import Competition, { ICompetition } from '../../models/Competition';
import Category from '../../models/Category';
import User from '../../models/User';

export const competitionService = {
  // Create new competition
  async createCompetition(data: any, organizerId: string): Promise<ICompetition> {
    const competition = await Competition.create({
      ...data,
      organizer: organizerId,
      coordinators: [organizerId],
    });
    return competition.populate('category organizer coordinators');
  },

  // Get all competitions with filters
  async getCompetitions(
    filters: {
      status?: string;
      category?: string;
      search?: string;
      limit?: number;
      page?: number;
    } = {}
  ) {
    const { status, category, search, limit = 10, page = 1 } = filters;
    const query: any = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const competitions = await Competition.find(query)
      .populate('category organizer')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Competition.countDocuments(query);

    return {
      data: competitions,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  },

  // Get single competition
  async getCompetitionById(competitionId: string): Promise<ICompetition | null> {
    return Competition.findById(competitionId)
      .populate('category organizer coordinators');
  },

  // Update competition
  async updateCompetition(competitionId: string, data: any): Promise<ICompetition | null> {
    return Competition.findByIdAndUpdate(competitionId, data, { new: true })
      .populate('category organizer coordinators');
  },

  // Delete competition
  async deleteCompetition(competitionId: string): Promise<boolean> {
    const result = await Competition.findByIdAndDelete(competitionId);
    return !!result;
  },

  // Get competitions by organizer
  async getByOrganizer(organizerId: string, limit = 10, page = 1) {
    const skip = (page - 1) * limit;
    const competitions = await Competition.find({ organizer: organizerId })
      .populate('category')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Competition.countDocuments({ organizer: organizerId });

    return {
      data: competitions,
      total,
      pages: Math.ceil(total / limit),
    };
  },

  // Update competition status
  async updateStatus(competitionId: string, status: string): Promise<ICompetition | null> {
    return Competition.findByIdAndUpdate(
      competitionId,
      { status },
      { new: true }
    ).populate('category organizer coordinators');
  },

  // Add coordinator
  async addCoordinator(competitionId: string, userId: string): Promise<ICompetition | null> {
    return Competition.findByIdAndUpdate(
      competitionId,
      { $addToSet: { coordinators: userId } },
      { new: true }
    ).populate('coordinators');
  },

  // Remove coordinator
  async removeCoordinator(competitionId: string, userId: string): Promise<ICompetition | null> {
    return Competition.findByIdAndUpdate(
      competitionId,
      { $pull: { coordinators: userId } },
      { new: true }
    ).populate('coordinators');
  },
};

export const categoryService = {
  // Create category
  async createCategory(data: any) {
    return Category.create(data);
  },

  // Get all categories
  async getAllCategories() {
    return Category.find().sort({ name: 1 });
  },

  // Get category by ID
  async getCategoryById(categoryId: string) {
    return Category.findById(categoryId);
  },

  // Update category
  async updateCategory(categoryId: string, data: any) {
    return Category.findByIdAndUpdate(categoryId, data, { new: true });
  },

  // Delete category
  async deleteCategory(categoryId: string) {
    return Category.findByIdAndDelete(categoryId);
  },
};
