/**
 * @swagger
 * /brand:
 *   post:
 *     summary: Create a new brand
 *     tags: [Brand]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       '201':
 *         description: Brand created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /brand/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Brand]
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
 *             $ref: '#/components/schemas/Brand'
 *     responses:
 *       '200':
 *         description: Brand updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       '404':
 *         description: Brand not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /brand/{id}:
 *   get:
 *     summary: Get a single brand
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Brand found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brand'
 *       '404':
 *         description: Brand not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /brand/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Brand]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Brand deleted successfully
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
 *         description: Brand not found
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /brand:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       '200':
 *         description: All brands
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 brands:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 *       '500':
 *         description: Server error
 */
