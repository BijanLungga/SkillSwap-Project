import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { createReview } from '../services/api';

interface ReviewModalProps {
  swapRequest: any;
  currentUser: any;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ReviewModal({
  swapRequest,
  currentUser,
  isOpen,
  onClose,
  onSuccess,
}: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  if (!isOpen || !swapRequest) return null;

  const partner =
    swapRequest.senderId === currentUser.id ? swapRequest.receiver : swapRequest.sender;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Silakan pilih rating antara 1 sampai 5 bintang');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await createReview({
        swapRequestId: swapRequest.id,
        reviewerId: currentUser.id,
        rating,
        comment,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengirim ulasan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-gray-900 mb-1">Beri Ulasan & Rating</h3>
        <p className="text-sm text-gray-500 mb-6">
          Bagikan pengalaman belajar dan barter keahlian bersama <span className="font-semibold text-gray-700">{partner?.name}</span>.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              Penilaian Kualitas Kolaborasi
            </label>
            <div className="flex justify-center items-center space-x-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-gray-500 font-medium">
              {rating === 5 && 'Sangat Baik - Sangat Merekomendasikan!'}
              {rating === 4 && 'Baik - Sesi belajar bermanfaat.'}
              {rating === 3 && 'Cukup - Sesuai ekspektasi.'}
              {rating === 2 && 'Kurang - Perlu peningkatan komunikasi.'}
              {rating === 1 && 'Sangat Kurang.'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ulasan & Catatan Kerjasama (Opsional)
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contoh: Sangat ramah, penjelasan konsep sangat mudah dipahami..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3 border"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              {loading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
