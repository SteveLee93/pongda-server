'use client';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

type ParentLeague = {
  id: number;
  name: string;
  description: string;
  city: string;
  district: string;
  createdBy: {
    nickname: string;
  };
  seasonLeagues: Array<{
    id: number;
    name: string;
    startDateTime: string;
    status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  }>;
};

export default function ParentLeagueDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();

  const { data: league, isLoading, error } = useQuery<ParentLeague>({
    queryKey: ['parentLeague', id],
    queryFn: async () => {
      const res = await api.get(`/parent-leagues/${id}`);
      return res.data;
    },
  });

  if (isLoading) return (
    <div className="max-w-4xl mx-auto p-4">
      <Navigation />
      <p className="text-center mt-10">로딩 중...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto p-4">
      <Navigation />
      <p className="text-center mt-10 text-red-500">리그 정보를 불러오지 못했습니다.</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Navigation />
      
      <div className="mt-8">
        <h1 className="text-2xl font-bold">{league?.name}</h1>
        <p className="text-gray-600 mt-2">{league?.description}</p>
        <div className="mt-4">
          <p className="text-sm text-gray-500">지역: {league?.city} {league?.district}</p>
          <p className="text-sm text-gray-500">생성자: {league?.createdBy.nickname}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">시즌 리그 목록</h2>
        <div className="space-y-4">
          {league?.seasonLeagues.map((seasonLeague) => (
            <Link href={`/season-leagues/${seasonLeague.id}`} key={seasonLeague.id}>
              <div className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{seasonLeague.name}</h3>
                    <p className="text-sm text-gray-500">
                      시작: {new Date(seasonLeague.startDateTime).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    seasonLeague.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                    seasonLeague.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {seasonLeague.status === 'UPCOMING' ? '예정' :
                     seasonLeague.status === 'IN_PROGRESS' ? '진행중' : '종료'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
