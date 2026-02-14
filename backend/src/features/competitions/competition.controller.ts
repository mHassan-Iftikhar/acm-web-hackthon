import { Request, Response } from "express";
import { competitionService, categoryService } from "./competition.service.js";

export const competitionController = {
  // Create competition
  async create(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        shortDescription,
        category,
        startDate,
        endDate,
        registrationDeadline,
        maxParticipants,
        venue,
        entryFee,
        rules,
        prizes,
      } = req.body;

      // Validate category exists
      const categoryExists = await categoryService.getCategoryById(category);
      if (!categoryExists) {
        return res.status(404).json({ error: "Category not found" });
      }

      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ status: "error", message: "User not authenticated" });
      }

      const competition = await competitionService.createCompetition(
        {
          title,
          description,
          shortDescription,
          category,
          startDate,
          endDate,
          registrationDeadline,
          maxParticipants,
          venue,
          entryFee,
          rules,
          prizes,
        },
        req.user.id,
      );

      res.status(201).json({
        status: "success",
        message: "Competition created successfully",
        data: competition,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to create competition",
      });
    }
  },

  // Get all competitions
  async getAll(req: Request, res: Response) {
    try {
      const { status, category, search, limit = "10", page = "1" } = req.query;

      const competitions = await competitionService.getCompetitions({
        status: status as string,
        category: category as string,
        search: search as string,
        limit: parseInt(limit as string),
        page: parseInt(page as string),
      });

      res.status(200).json({
        status: "success",
        data: competitions,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch competitions",
      });
    }
  },

  // Get single competition
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const competition = await competitionService.getCompetitionById(id);

      if (!competition) {
        return res.status(404).json({
          status: "error",
          message: "Competition not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: competition,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch competition",
      });
    }
  },

  // Update competition
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const competition = await competitionService.getCompetitionById(id);

      if (!competition) {
        return res.status(404).json({
          status: "error",
          message: "Competition not found",
        });
      }

      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ status: "error", message: "User not authenticated" });
      }

      // Only organizer can update
      if (competition.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "You are not authorized to update this competition",
        });
      }

      const updated = await competitionService.updateCompetition(id, req.body);

      res.status(200).json({
        status: "success",
        message: "Competition updated successfully",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to update competition",
      });
    }
  },

  // Delete competition
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const competition = await competitionService.getCompetitionById(id);

      if (!competition) {
        return res.status(404).json({
          status: "error",
          message: "Competition not found",
        });
      }

      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ status: "error", message: "User not authenticated" });
      }

      // Only organizer can delete
      if (competition.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "You are not authorized to delete this competition",
        });
      }

      await competitionService.deleteCompetition(id);

      res.status(200).json({
        status: "success",
        message: "Competition deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to delete competition",
      });
    }
  },

  // Get by organizer
  async getByOrganizer(req: Request, res: Response) {
    try {
      const { limit = "10", page = "1" } = req.query;

      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ status: "error", message: "User not authenticated" });
      }

      const competitions = await competitionService.getByOrganizer(
        req.user.id,
        parseInt(limit as string),
        parseInt(page as string),
      );

      res.status(200).json({
        status: "success",
        data: competitions,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch competitions",
      });
    }
  },

  // Update status
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!req.user || !req.user.id) {
        return res
          .status(401)
          .json({ status: "error", message: "User not authenticated" });
      }

      const competition = await competitionService.getCompetitionById(id);

      if (!competition) {
        return res.status(404).json({
          status: "error",
          message: "Competition not found",
        });
      }

      if (competition.organizer.toString() !== req.user.id) {
        return res.status(403).json({
          status: "error",
          message: "You are not authorized",
        });
      }

      const updated = await competitionService.updateStatus(id, status);

      res.status(200).json({
        status: "success",
        message: "Competition status updated",
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Get trending competitions
  async getTrending(req: Request, res: Response) {
    try {
      const { limit = "5" } = req.query;
      const competitions = await competitionService.getTrending(
        parseInt(limit as string),
      );
      res.status(200).json({ status: "success", data: competitions });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch trending competitions",
      });
    }
  },

  // Get popular competitions
  async getPopular(req: Request, res: Response) {
    try {
      const { limit = "5" } = req.query;
      const competitions = await competitionService.getPopular(
        parseInt(limit as string),
      );
      res.status(200).json({ status: "success", data: competitions });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch popular competitions",
      });
    }
  },

  // Get new competitions
  async getNew(req: Request, res: Response) {
    try {
      const { limit = "5" } = req.query;
      const competitions = await competitionService.getNew(
        parseInt(limit as string),
      );
      res.status(200).json({ status: "success", data: competitions });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch new competitions",
      });
    }
  },

  // Get upcoming competitions
  async getUpcoming(req: Request, res: Response) {
    try {
      const { limit = "5" } = req.query;
      const competitions = await competitionService.getUpcoming(
        parseInt(limit as string),
      );
      res.status(200).json({ status: "success", data: competitions });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch upcoming competitions",
      });
    }
  },
};

export const categoryController = {
  // Create category (admin only)
  async create(req: Request, res: Response) {
    try {
      const { name, description, icon, color } = req.body;

      const category = await categoryService.createCategory({
        name,
        description,
        icon,
        color,
      });

      res.status(201).json({
        status: "success",
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to create category",
      });
    }
  },

  // Get all categories
  async getAll(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();

      res.status(200).json({
        status: "success",
        data: categories,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch categories",
      });
    }
  },

  // Get single category
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const category = await categoryService.getCategoryById(id);

      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      res.status(200).json({
        status: "success",
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to fetch category",
      });
    }
  },

  // Update category (admin only)
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await categoryService.updateCategory(id, req.body);

      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Category updated successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to update category",
      });
    }
  },

  // Delete category (admin only)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const category = await categoryService.deleteCategory(id);

      if (!category) {
        return res.status(404).json({
          status: "error",
          message: "Category not found",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "error",
        message: error.message || "Failed to delete category",
      });
    }
  },
};
