/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Endpoints for managing products
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         brand:
 *           type: string
 *         sold:
 *           type: number
 *         quantity:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         color:
 *           type: string
 *         ratings:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               star:
 *                 type: number
 *               comment:
 *                 type: string
 *               postedBy:
 *                 type: string
 *         totalRatings:
 *           type: number
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination 
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of products per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sorting order (e.g., "createdAt" or "-createdAt")
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Selected fields to include in the response (comma-separated)
 *       - in: query
 *         name: ... (other query parameters)
 *         description: Other filtering options
 *     responses:
 *       200:
 *         description: All products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Products not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /product/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Product]
 *     parameters:
 *       Define path parameter for product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get a single product
 *     tags: [Product]
 *     parameters:
 *       Define path parameter for product ID
 *     responses:
 *       200:
 *         description: Product found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add or remove a product from wishlist
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added/removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Product or user not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /rating:
 *   post:
 *     summary: Rate a product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product rated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ratedProduct:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product or user not found
 *       500:
 *         description: Server error
 */
