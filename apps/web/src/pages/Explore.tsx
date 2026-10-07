import React, { useState, useEffect } from 'react';
import { exploreUsers, createSwapRequest } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { Search } from 'lucide-react';

export default function Explore({ currentUser }: { currentUser: any }) {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [skillType, setSkillType] = useState('');
  const [loading, setLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await exploreUsers({ search, skillType, userId: currentUser.id });
      setUsers(res.data.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [skillType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleRequest = async () => {
    if (!selectedUser) return;
    setError('');
    setSuccess('');
    try {
      await createSwapRequest({
        senderId: currentUser.id,
        receiverId: selectedUser.id,
        message
      });
      setSuccess('Permintaan berhasil dikirim!');
      setSelectedUser(null);
      setMessage('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengirim permintaan');
      setSelectedUser(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Cari Partner Pertukaran</h1>
        
        {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded">{error}</div>}
        {success && <div className="mb-4 bg-green-50 text-green-600 p-3 rounded">{success}</div>}

        <form onSubmit={handleSearch} className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Cari keahlian..."
            />
          </div>
          <div>
            <select
              value={skillType}
              onChange={(e) => setSkillType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
            >
              <option value="">Semua</option>
              <option value="HAVE">Ditawarkan Partner</option>
              <option value="WANT">Dicari Partner</option>
            </select>
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cari
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Memuat...</div>
      ) : users.length === 0 ? (
        <EmptyState title="Tidak ada hasil" description="Coba ubah kata kunci pencarian." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
              <div className="p-6 flex-1">
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2 mb-4">{user.bio || '-'}</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Ditawarkan:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsHave.map((s:any) => <SkillBadge key={s.id} skillName={s.skillName} skillType="HAVE" />)}
                      {user.skillsHave.length === 0 && <span className="text-xs text-gray-400">Kosong</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Dicari:</h4>
                    <div className="flex flex-wrap gap-1">
                      {user.skillsWant.map((s:any) => <SkillBadge key={s.id} skillName={s.skillName} skillType="WANT" />)}
                      {user.skillsWant.length === 0 && <span className="text-xs text-gray-400">Kosong</span>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                >
                  Kirim Permintaan Tukar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectedUser(null)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">Kirim Permintaan ke {selectedUser.name}</h3>
                <textarea
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                  placeholder="Tuliskan pesan mengapa Anda ingin bertukar keahlian dengannya..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                <button onClick={handleRequest} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                  Kirim
                </button>
                <button onClick={() => setSelectedUser(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
