import { Router } from 'express';
import {
  createDonation,
  getDonations,
  claimDonation,
  confirmDonation
} from '../controllers/donation.controller.js';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware.js';
import { UserType } from '../generated/prisma/index.js';

const donationRouter = Router();

donationRouter.use(protectRoute);

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Create a new donation (Donors only)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - quantity
 *               - unit
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Pan integral
 *               quantity:
 *                 type: number
 *                 example: 20
 *               unit:
 *                 type: string
 *                 example: unidades
 *     responses:
 *       200:
 *         description: Donation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only donors can create donations
 */
donationRouter.post('/', restrictTo(UserType.DONOR), createDonation);

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     description: Returns available donations for beneficiaries, or all donations for donors
 *     responses:
 *       200:
 *         description: Donations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Donation'
 */
donationRouter.get('/', getDonations);

/**
 * @swagger
 * /api/donations/{id}/claim:
 *   post:
 *     summary: Claim a donation (Beneficiaries only)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Donation ID
 *     responses:
 *       200:
 *         description: Donation claimed successfully
 *       400:
 *         description: Donation not available
 *       403:
 *         description: Forbidden - Only beneficiaries can claim donations
 *       404:
 *         description: Donation not found
 */
donationRouter.post('/:id/claim', restrictTo(UserType.BENEFICIARY), claimDonation);

/**
 * @swagger
 * /api/donations/{id}/confirm:
 *   post:
 *     summary: Confirm donation delivery
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Donation ID
 *     responses:
 *       200:
 *         description: Donation confirmed successfully
 *       400:
 *         description: Invalid donation status
 *       403:
 *         description: Unauthorized to confirm this donation
 *       404:
 *         description: Donation not found
 */
donationRouter.post('/:id/confirm', confirmDonation);

export default donationRouter;
