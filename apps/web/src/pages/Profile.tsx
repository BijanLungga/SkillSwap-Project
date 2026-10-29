import React, { useEffect, useState } from 'react';
import { getUser, updateUser, getUserSkills, addSkill, deleteSkill, getUserReputation, getUserReviews } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import ReputationBadge from '../components/ReputationBadge';
import { Star } from 'lucide-react';

export default function Profile({ currentUser, onUpdateUser }: { currentUser: any, onUpdateUser: (u:any)=>void }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [skills, setSkills] = useState<any[]>([]);
  const [reputation, setReputation] = useState<{ averageRating: number; totalReviews: number }>({ averageRating: 0, totalReviews: 0 });
  const [reviews, setReviews] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [newSkill, setNewSkill] = useState({ skillName: '', skillType: 'HAVE' as 'HAVE' | 'WANT' });
  
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getUser(currentUser.id);
      setProfile(res.data.data);
      setFormData({ name: res.data.data.name, bio: res.data.data.bio || '' });
      const skillsRes = await getUserSkills(currentUser.id);
      setSkills(skillsRes.data.data);

      // Fetch reputation & reviews for Fitur 10
      const [repRes, revRes] = await Promise.all([
        getUserReputation(currentUser.id),
        getUserReviews(currentUser.id),
      ]);
      setReputation(repRes.data.data);
      setReviews(revRes.data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Gagal memuat profil pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser.id]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateUser(currentUser.id, formData);
      setProfile(res.data.data);
      onUpdateUser({ ...currentUser, name: res.data.data.name });
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSkill(currentUser.id, newSkill);
      setNewSkill({ skillName: '', skillType: 'HAVE' });
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async () => {
    if (!confirmDelete) return;
    try {
      await deleteSkill(confirmDelete);
      setConfirmDelete(null);
      fetchProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500 font-medium">Memuat data profil...</div>;
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-xl shadow-md p-6 text-center border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Gagal Memuat Profil</h3>
        <p className="text-sm text-gray-600 mb-6">
          {error || 'Data akun tidak ditemukan di basis data atau sesi login telah kedaluwarsa.'}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem('skillswap_user');
            window.location.reload();
          }}
          className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
        >
          Keluar & Login Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profil Pengguna</h3>
            {!editMode && (
              <button onClick={() => setEditMode(true)} className="text-indigo-600 text-sm font-medium hover:text-indigo-500">
                Edit Profil
              </button>
            )}
          </div>
          
          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" rows={3} />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Simpan</button>
                <button type="button" onClick={() => setEditMode(false)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Batal</button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Nama Lengkap</h4>
                <p className="mt-1 text-sm text-gray-900">{profile.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                <p className="mt-1 text-sm text-gray-900">{profile.bio || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Kelola Keahlian</h3>
          
          <form onSubmit={handleAddSkill} className="flex gap-4 items-end mb-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Keahlian Baru</label>
              <input type="text" required value={newSkill.skillName} onChange={(e) => setNewSkill({...newSkill, skillName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border" placeholder="Cth: React, Desain Grafis" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe</label>
              <select value={newSkill.skillType} onChange={(e) => setNewSkill({...newSkill, skillType: e.target.value as any})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border">
                <option value="HAVE">Keahlian Dimiliki</option>
                <option value="WANT">Ingin Dipelajari</option>
              </select>
            </div>
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
              Tambah
            </button>
          </form>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Keahlian yang Saya Miliki</h4>
            <div className="flex flex-wrap gap-2">
              {skills.filter(s => s.skillType === 'HAVE').length === 0 ? <span className="text-sm text-gray-400">Belum ada</span> : null}
              {skills.filter(s => s.skillType === 'HAVE').map(skill => (
                <SkillBadge key={skill.id} skillName={skill.skillName} skillType="HAVE" onDelete={() => setConfirmDelete(skill.id)} />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Keahlian yang Ingin Dipelajari</h4>
            <div className="flex flex-wrap gap-2">
              {skills.filter(s => s.skillType === 'WANT').length === 0 ? <span className="text-sm text-gray-400">Belum ada</span> : null}
              {skills.filter(s => s.skillType === 'WANT').map(skill => (
                <SkillBadge key={skill.id} skillName={skill.skillName} skillType="WANT" onDelete={() => setConfirmDelete(skill.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fitur 10: Sistem Ulasan & Reputasi Partner */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Reputasi & Ulasan Partner</h3>
              <p className="text-xs text-gray-500 mt-0.5">Penilaian dari pengguna lain yang telah menyelesaikan sesi barter skill dengan Anda.</p>
            </div>
            <div className="bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
              <ReputationBadge
                averageRating={reputation.averageRating}
                totalReviews={reputation.totalReviews}
                size="lg"
              />
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg">
              Belum ada ulasan yang diterima. Selesaikan sesi pertukaran keahlian untuk mulai membangun reputasi Anda!
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-gray-900">{rev.reviewer?.name}</span>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3.5 w-3.5 ${
                            star <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-600 ml-1.5 font-medium">{rev.rating}/5</span>
                    </div>
                  </div>
                  {rev.comment && <p className="text-sm text-gray-700 italic">"{rev.comment}"</p>}
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Hapus Keahlian"
        message="Apakah Anda yakin ingin menghapus keahlian ini?"
        onConfirm={handleDeleteSkill}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
