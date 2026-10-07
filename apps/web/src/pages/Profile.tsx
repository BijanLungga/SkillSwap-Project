import React, { useEffect, useState } from 'react';
import { getUser, updateUser, getUserSkills, addSkill, deleteSkill } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Profile({ currentUser, onUpdateUser }: { currentUser: any, onUpdateUser: (u:any)=>void }) {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', bio: '' });
  const [newSkill, setNewSkill] = useState({ skillName: '', skillType: 'HAVE' as 'HAVE' | 'WANT' });
  
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const res = await getUser(currentUser.id);
      setProfile(res.data.data);
      setFormData({ name: res.data.data.name, bio: res.data.data.bio || '' });
      const skillsRes = await getUserSkills(currentUser.id);
      setSkills(skillsRes.data.data);
    } catch (err) {
      console.error(err);
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

  if (!profile) return <div className="p-8 text-center">Memuat...</div>;

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
