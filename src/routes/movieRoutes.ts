import { Router } from "express";
import { MovieController } from "../controllers/movieController.js";

const router = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     responses:
 *       200:
 *         description: List of movies
 */
router.get("/movies", MovieController.getAll);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A movie object
 *       404:
 *         description: Movie not found
 */
router.get("/movies/:id", MovieController.getOne);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Movie created
 */
router.post("/movies", MovieController.create);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update a movie
 */
router.put("/movies/:id", MovieController.update);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 */
router.delete("/movies/:id", MovieController.delete);

/**
 * @swagger
 * /api/movies/{id}/details:
 *   get:
 *     summary: Get movie with external TMDB details
 */
router.get("/movies/:id/details", MovieController.getWithDetails);

export default router;
