const express = require('express');
const { getNotifications, markAsRead, markAllAsRead } = require('../controllers/notification.controller');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifikasi interaksi komunitas
 */

// Semua rute notifikasi butuh autentikasi
router.use(authenticate);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Mendapatkan daftar notifikasi pengguna
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar notifikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
 */
router.get('/', getNotifications);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Tandai semua notifikasi telah dibaca
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil menandai semua notifikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Semua notifikasi telah dibaca
 */
router.put('/read-all', markAllAsRead);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Tandai satu notifikasi telah dibaca
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil menandai notifikasi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notifikasi tidak ditemukan
 *       403:
 *         description: Akses ditolak
 */
router.put('/:id/read', markAsRead);

module.exports = router;
