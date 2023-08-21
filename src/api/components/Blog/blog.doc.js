/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Endpoints for managing blog posts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         images:
 *           type: string
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         dislikes:
 *           type: array
 *           items:
 *             type: string
 *         viewsCount:
 *           type: number
 *         isLiked:
 *           type: boolean
 *         isDisliked:
 *           type: boolean
 */

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '201':
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   patch:
 *     summary: Update a blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Blog'
 *     responses:
 *       '200':
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a single blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Blog post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /blog:
 *   get:
 *     summary: Get all blog posts with pagination, sorting, and filtering
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default: 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of blog posts per page (default: 10)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting order (e.g., "createdAt" or "-createdAt")
 *       - in: query
 *         name: ... (other query parameters)
 *         description: Other filtering options
 *     responses:
 *       '200':
 *         description: All blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Blog post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Server error
 */
