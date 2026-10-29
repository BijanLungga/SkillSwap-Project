import React, { useEffect, useState } from 'react';
import { getUserReputation, getUserReviews } from '../services/api';
import { Star, X, MessageSquareQuote } from 'lucide-react';

interface PartnerReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export default function PartnerReviewsModal({
  isOpen,
  onClose,
  userId,
  userName,
}: PartnerReviewsModalProps) {
  const [loading, setLoading] = useState(true);
  const [reputation, setReputation] = useState<{ averageRating: number; totalReviews: number }>({
    averageRating: 0,
    totalReviews: 0,
  });
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchReviews = async () => {
        try {
          setLoading(true);
          const [repRes, revRes] = await Promise.all([
            getUserReputation(userId),
            getUserReviews(userId),
          ]);
          setReputation(repRes.data.data);
          setReviews(revRes.data.data);
        } catch (err) {
          console.error('Gagal mengambil ulasan partner:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchReviews();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative max-h-[85vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b border-gray-100 pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900">Ulasan & Reputasi Partner</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Daftar testimoni untuk <span className="font-semibold text-gray-800">{userName}</span>
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 font-medium">Memuat ulasan partner...</div>
        ) : (
          <>
            {/* Rating Summary Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {reputation.totalReviews > 0 ? reputation.averageRating.toFixed(1) : '-'}
                    </span>
                    <span className="text-sm text-gray-500 font-medium">/ 5.0</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">
                    Berdasarkan {reputation.totalReviews} ulasan pertukaran
                  </p>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(reputation.averageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {reviews.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-500 bg-gray-50 rounded-lg">
                  <MessageSquareQuote className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  Belum ada ulasan yang ditulis untuk partner ini.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-gray-900">
                        {rev.reviewer?.name || 'Partner Belajar'}
                      </span>
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-600 ml-1.5 font-semibold">{rev.rating}/5</span>
                      </div>
                    </div>
                    {rev.comment ? (
                      <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded border border-gray-100 mt-1">
                        "{rev.comment}"
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-1">Tidak ada catatan ulasan teks.</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2">
                      {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium rounded-lg"
              >
                Tutup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
