/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: Endpoints for managing cart
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add products to user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     count:
 *                       type: number
 *                     color:
 *                       type: string
 *     responses:
 *       '200':
 *         description: Cart saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: User's cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       '404':
 *         description: Cart is empty
 *       '500':
 *         description: Server error
 */

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Empty user's cart
 *     tags: [Cart]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Server error
 */
