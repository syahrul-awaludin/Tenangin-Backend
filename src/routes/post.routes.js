const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Operasi CRUD untuk Community Posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Buat post baru
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - content
 *             properties:
 *               subject:
 *                 type: string
 *               content:
 *                 type: string
 *               mood:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post berhasil dibuat
 */
router.post('/', postController.createPost);

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Dapatkan daftar post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar post
 */
router.get('/', postController.getPosts);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Hapus post (Hanya Author atau Admin)
 *     tags: [Posts]
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
 *         description: Berhasil menghapus post
 */
router.delete('/:id', postController.deletePost);

// -- COMMENTS --
router.post('/:postId/comments', postController.addComment);
router.get('/:postId/comments', postController.getComments);
router.delete('/comments/:commentId', postController.deleteComment);

// -- LIKES --
router.post('/:postId/like', postController.toggleLike);

module.exports = router;
