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
 *         description: Berhasil
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
 *         description: Berhasil
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
 *         description: Berhasil
 */
router.put('/:id/read', markAsRead);

module.exports = router;
