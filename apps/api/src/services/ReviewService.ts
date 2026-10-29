import prisma from '../config/database';
import { createNotification } from './NotificationService';

export interface CreateReviewInput {
  swapRequestId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
}

export const createReview = async (input: CreateReviewInput) => {
  const { swapRequestId, reviewerId, rating, comment } = input;

  if (!swapRequestId || !reviewerId) {
    throw new Error('ID pertukaran dan ID pengulas wajib diisi');
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    throw new Error('Rating harus berupa angka bulat antara 1 sampai 5');
  }

  const swapRequest = await prisma.swapRequest.findUnique({
    where: { id: swapRequestId },
    include: {
      sender: { select: { id: true, name: true } },
      receiver: { select: { id: true, name: true } },
    },
  });

  if (!swapRequest) {
    throw new Error('Permintaan pertukaran tidak ditemukan');
  }

  if (swapRequest.status !== 'COMPLETED') {
    throw new Error('Ulasan hanya dapat diberikan untuk pertukaran yang sudah selesai');
  }

  const isSender = swapRequest.senderId === reviewerId;
  const isReceiver = swapRequest.receiverId === reviewerId;

  if (!isSender && !isReceiver) {
    throw new Error('Anda tidak memiliki izin memberikan ulasan pada pertukaran ini');
  }

  const targetUserId = isSender ? swapRequest.receiverId : swapRequest.senderId;
  const reviewerName = isSender ? swapRequest.sender.name : swapRequest.receiver.name;

  if (reviewerId === targetUserId) {
    throw new Error('Tidak dapat memberikan ulasan kepada diri sendiri');
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      swapRequestId,
      reviewerId,
    },
  });

  if (existingReview) {
    throw new Error('Anda sudah memberikan ulasan untuk pertukaran ini');
  }

  const review = await prisma.review.create({
    data: {
      swapRequestId,
      reviewerId,
      targetUserId,
      rating,
      comment: comment?.trim() || null,
    },
    include: {
      reviewer: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  // Kirim notifikasi ke penerima ulasan
  try {
    await createNotification({
      userId: targetUserId,
      type: 'REVIEW_RECEIVED',
      title: 'Ulasan Baru Diterima',
      message: `${reviewerName} memberikan rating ${rating} bintang untuk pertukaran keahlian Anda.`,
      link: '/profile',
    });
  } catch (err) {
    // Fail-safe
  }

  return review;
};

export const getUserReviews = async (targetUserId: string) => {
  if (!targetUserId) throw new Error('ID pengguna wajib diisi');

  return prisma.review.findMany({
    where: { targetUserId },
    include: {
      reviewer: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getUserReputation = async (userId: string) => {
  if (!userId) throw new Error('ID pengguna wajib diisi');

  const reviews = await prisma.review.findMany({
    where: { targetUserId: userId },
    select: { rating: true },
  });

  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  }

  const sumRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = parseFloat((sumRating / totalReviews).toFixed(1));

  return {
    averageRating,
    totalReviews,
  };
};

export const getSwapReviews = async (swapRequestId: string) => {
  if (!swapRequestId) throw new Error('ID pertukaran wajib diisi');

  return prisma.review.findMany({
    where: { swapRequestId },
    include: {
      reviewer: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};
