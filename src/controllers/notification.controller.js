const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true } },
        post: { select: { id: true, subject: true } },
      },
    });

    res.status(200).json({
      status: 'success',
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      return res.status(404).json({ error: { message: 'Notifikasi tidak ditemukan' } });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({ error: { message: 'Akses ditolak' } });
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json({ status: 'success', data: updated });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    res.status(200).json({ status: 'success', message: 'Semua notifikasi telah dibaca' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
