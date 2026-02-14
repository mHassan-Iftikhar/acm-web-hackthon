import express from 'express';
import { verifyAuth } from '../../middleware/auth';
import { competitionController, categoryController } from './competition.controller';

const router = express.Router();

// Competition Routes
router.post('/competitions', verifyAuth, competitionController.create);
router.get('/competitions', competitionController.getAll);
router.get('/competitions/:id', competitionController.getById);
router.patch('/competitions/:id', verifyAuth, competitionController.update);
router.delete('/competitions/:id', verifyAuth, competitionController.delete);
router.get('/competitions/organizer/my-competitions', verifyAuth, competitionController.getByOrganizer);
router.patch('/competitions/:id/status', verifyAuth, competitionController.updateStatus);

// Category Routes
router.post('/categories', verifyAuth, categoryController.create); // Admin only
router.get('/categories', categoryController.getAll);
router.get('/categories/:id', categoryController.getById);
router.patch('/categories/:id', verifyAuth, categoryController.update); // Admin only
router.delete('/categories/:id', verifyAuth, categoryController.delete); // Admin only

export default router;
