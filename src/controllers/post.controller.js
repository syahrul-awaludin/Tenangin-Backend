const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createPost = async (req, res, next) => {
  try {
    const { subject, content, mood } = req.body;
    const authorId = req.user.id; // From authenticate middleware

    const post = await prisma.post.create({
      data: {
        subject,
        content,
        mood,
        authorId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Post created successfully',
      data: {
        ...post,
        stats: { likeCount: 0, commentCount: 0 },
        isLikedByMe: false,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, content, mood } = req.body;
    const authorId = req.user.id;

    // Pastikan post ada dan milik user tersebut
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Post tidak ditemukan' } });
    }
    if (post.authorId !== authorId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Anda tidak memiliki akses untuk mengedit post ini' } });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: { subject, content, mood },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.json({
      status: 'success',
      message: 'Post berhasil diubah',
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId } },
      },
    });

    const formattedPosts = posts.map(post => ({
      id: post.id,
      subject: post.subject,
      content: post.content,
      mood: post.mood,
      createdAt: post.createdAt,
      author: post.author,
      stats: {
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      },
      isLikedByMe: post.likes.length > 0,
    }));

    res.status(200).json({
      status: 'success',
      data: formattedPosts,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return res.status(404).json({ error: { message: 'Post tidak ditemukan' } });
    }

    if (post.authorId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ error: { message: 'Akses ditolak' } });
    }

    await prisma.post.delete({ where: { id } });
    res.status(200).json({ status: 'success', message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { text, parentId } = req.body;
    const authorId = req.user.id;

    const data = { text, postId, authorId };
    if (parentId) data.parentId = parentId;

    const comment = await prisma.comment.create({
      data,
      include: { author: { select: { id: true, name: true } } },
    });

    // Cari tahu siapa pemilik post
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (post && post.authorId !== authorId) {
      const notif = await prisma.notification.create({
        data: {
          userId: post.authorId,
          senderId: authorId,
          type: 'COMMENT',
          postId: postId,
        },
      });

      // Trigger WebSockets Notification
      req.app.get('io')?.to(`user:${post.authorId}`).emit('new_notification', {
        id: notif.id,
        type: 'COMMENT',
        title: 'Komentar Baru',
        body: `${comment.author.name} mengomentari postinganmu`,
        postId: postId,
      });
    }

    res.status(201).json({ status: 'success', data: comment });
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: { 
        author: { select: { id: true, name: true } },
        replies: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' }
        }
      },
    });
    res.status(200).json({ status: 'success', data: comments });
  } catch (error) {
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: { message: 'Komentar tidak ditemukan' } });
    
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: { message: 'Hanya author yang bisa edit komentar' } });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { text },
    });
    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: { message: 'Komentar tidak ditemukan' } });
    
    if (comment.authorId !== userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: { message: 'Akses ditolak' } });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.status(200).json({ status: 'success', message: 'Komentar dihapus' });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existingLike = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
    } else {
      await prisma.like.create({ data: { postId, userId } });

      const post = await prisma.post.findUnique({ where: { id: postId } });
      if (post && post.authorId !== userId) {
        const notif = await prisma.notification.create({
          data: {
            userId: post.authorId,
            senderId: userId,
            type: 'LIKE',
            postId: postId,
          },
        });

        const sender = await prisma.user.findUnique({ where: { id: userId } });
        
        // Trigger WebSockets Notification
        req.app.get('io')?.to(`user:${post.authorId}`).emit('new_notification', {
          id: notif.id,
          type: 'LIKE',
          title: 'Suka Baru',
          body: `${sender?.name || 'Seseorang'} menyukai postinganmu`,
          postId: postId,
        });
      }
    }

    const totalLikes = await prisma.like.count({ where: { postId } });
    
    res.status(200).json({
      status: 'success',
      data: {
        isLiked: !existingLike,
        totalLikes,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  updatePost,
  getPosts,
  deletePost,
  addComment,
  getComments,
  deleteComment,
  editComment,
  toggleLike,
};
