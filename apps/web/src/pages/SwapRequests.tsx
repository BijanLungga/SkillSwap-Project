import React, { useEffect, useState } from 'react';
import { getSwapRequests, updateSwapRequest, getMessages, sendMessage, getSwapReviews } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import SkillBadge from '../components/SkillBadge';
import EmptyState from '../components/EmptyState';
import ReviewModal from '../components/ReviewModal';
import PartnerReviewsModal from '../components/PartnerReviewsModal';
import { Send, Star, CheckCircle2 } from 'lucide-react';

export default function SwapRequests({ currentUser }: { currentUser: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [reviewModalSwap, setReviewModalSwap] = useState<any>(null);
  const [selectedPartnerForReviews, setSelectedPartnerForReviews] = useState<any>(null);
  const [reviewedSwapIds, setReviewedSwapIds] = useState<Record<string, any>>({});

  const fetchRequests = async () => {
    try {
      const res = await getSwapRequests(currentUser.id);
      const reqList = res.data.data;
      setRequests(reqList);

      // Fetch reviews for completed swaps
      const completed = reqList.filter((r: any) => r.status === 'COMPLETED');
      const reviewsMap: Record<string, any> = {};
      await Promise.all(
        completed.map(async (r: any) => {
          try {
            const revRes = await getSwapReviews(r.id);
            const myReview = revRes.data.data?.find((rev: any) => rev.reviewerId === currentUser.id);
            if (myReview) {
              reviewsMap[r.id] = myReview;
            }
          } catch (err) {
            // Ignored
          }
        })
      );
      setReviewedSwapIds(reviewsMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser.id]);

  useEffect(() => {
    let interval: any;
    if (selectedChat) {
      const fetchChat = async () => {
        try {
          const res = await getMessages(selectedChat.id);
          setMessages(res.data.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchChat();
      interval = setInterval(fetchChat, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedChat]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateSwapRequest(id, { status });
      fetchRequests();
      if (selectedChat && id === selectedChat.id && status === 'COMPLETED') {
        setSelectedChat(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    try {
      await sendMessage(selectedChat.id, { senderId: currentUser.id, messageText: newMessage });
      setNewMessage('');
      const res = await getMessages(selectedChat.id);
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter(req => activeTab === 'ALL' || req.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6 h-[calc(100vh-4rem)]">
      <div className={`flex-1 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Permintaan Tukar</h1>
        
        <div className="mb-4 bg-white rounded-lg shadow p-2 flex flex-wrap gap-2">
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab === 'ALL' ? 'Semua' : 
               tab === 'PENDING' ? 'Menunggu' : 
               tab === 'ACCEPTED' ? 'Disetujui' : 
               tab === 'REJECTED' ? 'Ditolak' : 'Selesai'}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {loading ? (
            <div className="text-center py-8">Memuat...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8"><EmptyState title="Tidak ada permintaan" description="Belum ada permintaan di kategori ini." /></div>
          ) : (
            filteredRequests.map(req => {
              const isOutgoing = req.senderId === currentUser.id;
              const partner = isOutgoing ? req.receiver : req.sender;
              return (
                <div key={req.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{partner.name}</h3>
                      <p className="text-xs text-gray-500">{isOutgoing ? 'Anda mengirim ke ' : 'Menerima dari '}{partner.email}</p>
                      <button
                        onClick={() => setSelectedPartnerForReviews(partner)}
                        className="text-xs text-amber-600 hover:text-amber-700 inline-flex items-center gap-1 font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                        Lihat Ulasan Partner
                      </button>
                    </div>
                    <StatusBadge status={req.status} />
                  </div>
                  <div className="text-sm text-gray-700 mb-4 bg-gray-50 p-2 rounded line-clamp-2">
                    "{req.message || 'Tidak ada pesan'}"
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-end">
                    {!isOutgoing && req.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')} className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700">Terima</button>
                        <button onClick={() => handleUpdateStatus(req.id, 'REJECTED')} className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700">Tolak</button>
                      </>
                    )}
                    {req.status === 'ACCEPTED' && (
                      <>
                        <button onClick={() => setSelectedChat(req)} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700">Buka Chat</button>
                        <button onClick={() => handleUpdateStatus(req.id, 'COMPLETED')} className="px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700">Tandai Selesai</button>
                      </>
                    )}
                    {req.status === 'COMPLETED' && (
                      <div>
                        {reviewedSwapIds[req.id] ? (
                          <div className="inline-flex items-center text-xs text-green-700 bg-green-50 px-2.5 py-1.5 rounded-md border border-green-200">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-600" />
                            <span>Sudah Diulas (Rating {reviewedSwapIds[req.id].rating}/5)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReviewModalSwap(req)}
                            className="inline-flex items-center px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded hover:bg-amber-600 shadow-sm"
                          >
                            <Star className="h-4 w-4 mr-1 fill-white" />
                            Beri Ulasan & Rating
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedChat && (
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow border border-gray-200 h-[calc(100vh-8rem)]">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center rounded-t-lg">
            <h3 className="font-medium text-gray-900">
              Chat dengan {selectedChat.senderId === currentUser.id ? selectedChat.receiver.name : selectedChat.sender.name}
            </h3>
            <button onClick={() => setSelectedChat(null)} className="md:hidden text-gray-400 hover:text-gray-600">&times;</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map(msg => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 ${isMine ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-900'}`}>
                    <p className="text-sm">{msg.messageText}</p>
                    <span className={`text-[10px] mt-1 block ${isMine ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 border py-2"
                placeholder="Tulis pesan..."
              />
              <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {reviewModalSwap && (
        <ReviewModal
          isOpen={!!reviewModalSwap}
          swapRequest={reviewModalSwap}
          currentUser={currentUser}
          onClose={() => setReviewModalSwap(null)}
          onSuccess={() => fetchRequests()}
        />
      )}

      {selectedPartnerForReviews && (
        <PartnerReviewsModal
          isOpen={!!selectedPartnerForReviews}
          userId={selectedPartnerForReviews.id}
          userName={selectedPartnerForReviews.name}
          onClose={() => setSelectedPartnerForReviews(null)}
        />
      )}
    </div>
  );
}
