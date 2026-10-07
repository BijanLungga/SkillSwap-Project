import React, { useEffect, useState } from 'react';
import { getDashboard } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import EmptyState from '../components/EmptyState';
import { BookOpen, Target, Users, Clock, UsersRound } from 'lucide-react';

export default function Dashboard({ currentUser }: { currentUser: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard(currentUser.id);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [currentUser.id]);

  if (loading) return <div className="p-8 text-center">Memuat...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Gagal memuat data dashboard.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Selamat datang, {currentUser.name}!</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center text-green-600 mb-2">
            <BookOpen className="h-5 w-5 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Keahlian Dimiliki</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.totalSkillsHave}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center text-blue-600 mb-2">
            <Target className="h-5 w-5 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Keahlian Diinginkan</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.totalSkillsWant}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center text-indigo-600 mb-2">
            <Users className="h-5 w-5 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Pertukaran Aktif</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.totalActiveSwaps}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
          <div className="flex items-center text-yellow-600 mb-2">
            <Clock className="h-5 w-5 mr-2" />
            <h3 className="text-sm font-medium text-gray-500">Menunggu Persetujuan</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.stats.totalPendingRequests}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Partner Terhubung</h3>
        </div>
        {data.partners.length === 0 ? (
          <EmptyState icon={<UsersRound />} title="Belum ada partner" description="Anda belum memiliki pertukaran aktif." />
        ) : (
          <ul className="divide-y divide-gray-200">
            {data.partners.map((partner: any) => (
              <li key={partner.userId} className="p-4 sm:px-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{partner.name}</p>
                    <p className="text-sm text-gray-500">{partner.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {partner.skills.map((skill: any, idx: number) => (
                        <SkillBadge key={idx} skillName={skill.skillName} skillType={skill.skillType} />
                      ))}
                    </div>
                  </div>
                  <a href="/swap-requests" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Buka Chat
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
