'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// 타입 정의
type SeasonLeague = {
  id: number;
  name: string;
  description: string;
  seasonInfo: string;
  startDateTime: string;
  matchFormat: 'BEST_OF_3' | 'BEST_OF_5' | 'BEST_OF_7';
  gameType: 'SINGLES' | 'DOUBLES';
  qualifierFormat: 'ROUND_ROBIN' | 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';
  playoffFormat: 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION';
  status: 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED';
  parentLeague: {
    id: number;
    name: string;
    city: string;
    district: string;
  };
  participants: Array<{
    id: number;
    user: {
      id: number;
      nickname: string;
    };
    qualifierRank?: number;
    qualifierPoints?: number;
    playoffRank?: number;
  }>;
  matches: Array<{
    id: number;
    player1: { nickname: string };
    player2: { nickname: string };
    scorePlayer1: number;
    scorePlayer2: number;
    winner?: { nickname: string };
    matchDate: string;
    stage: 'QUALIFIER' | 'PLAYOFF';
    round: number;
  }>;
};

export default function SeasonLeagueDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'qualifier' | 'playoff' | 'results'>('qualifier');
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // 시즌 리그 정보 조회
  const { data: league, isLoading, error } = useQuery<SeasonLeague>({
    queryKey: ['seasonLeague', id],
    queryFn: async () => {
      const res = await api.get(`/season-leagues/${id}`);
      return res.data;
    },
  });

  // 경기 결과 업데이트 뮤테이션
  const updateMatchMutation = useMutation({
    mutationFn: async ({ matchId, scorePlayer1, scorePlayer2 }: { matchId: number, scorePlayer1: number, scorePlayer2: number }) => {
      await api.patch(`/matches/${matchId}`, { scorePlayer1, scorePlayer2 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonLeague', id] });
    },
  });

  if (isLoading) return (
    <div className="max-w-6xl mx-auto p-4">
      <Navigation />
      <p className="text-center mt-10">로딩 중...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto p-4">
      <Navigation />
      <p className="text-center mt-10 text-red-500">리그 정보를 불러오지 못했습니다.</p>
    </div>
  );

  // 예선 라운드의 참가자들을 그룹으로 나누기
  const qualifierGroups = league?.participants.reduce((groups, participant) => {
    const groupIndex = participant.qualifierRank ? Math.floor((participant.qualifierRank - 1) / 4) : 0;
    if (!groups[groupIndex]) groups[groupIndex] = [];
    groups[groupIndex].push(participant);
    return groups;
  }, [] as Array<typeof league.participants>);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Navigation />

      {/* 리그 기본 정보 */}
      <div className="mt-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{league?.name}</h1>
            <p className="text-gray-600 mt-2">{league?.description}</p>
            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-500">시작: {new Date(league?.startDateTime || '').toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                지역: {league?.parentLeague.city} {league?.parentLeague.district}
              </p>
              <p className="text-sm text-gray-500">
                경기 방식: {league?.gameType === 'SINGLES' ? '단식' : '복식'} / 
                {league?.matchFormat === 'BEST_OF_3' ? '3판 2선승' : 
                 league?.matchFormat === 'BEST_OF_5' ? '5판 3선승' : '7판 4선승'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-full text-sm ${
              league?.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
              league?.status === 'IN_PROGRESS' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {league?.status === 'UPCOMING' ? '예정' :
               league?.status === 'IN_PROGRESS' ? '진행중' : '종료'}
            </span>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="mt-8 border-b">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('qualifier')}
            className={`pb-4 px-2 ${activeTab === 'qualifier' ? 
              'border-b-2 border-blue-500 text-blue-600 font-semibold' : 
              'text-gray-500'}`}
          >
            예선
          </button>
          <button
            onClick={() => setActiveTab('playoff')}
            className={`pb-4 px-2 ${activeTab === 'playoff' ? 
              'border-b-2 border-blue-500 text-blue-600 font-semibold' : 
              'text-gray-500'}`}
          >
            본선
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-4 px-2 ${activeTab === 'results' ? 
              'border-b-2 border-blue-500 text-blue-600 font-semibold' : 
              'text-gray-500'}`}
          >
            전체 결과
          </button>
        </div>
      </div>

      {/* 예선 현황 */}
      {activeTab === 'qualifier' && (
        <div className="mt-6">
          {/* 조별 순위표 */}
          <div className="grid grid-cols-2 gap-6">
            {qualifierGroups?.map((group, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">{index + 1}조</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">순위</th>
                      <th className="py-2 text-left">선수</th>
                      <th className="py-2 text-center">경기</th>
                      <th className="py-2 text-center">승</th>
                      <th className="py-2 text-center">패</th>
                      <th className="py-2 text-right">승점</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group
                      .sort((a, b) => (b.qualifierPoints || 0) - (a.qualifierPoints || 0))
                      .map((participant, idx) => (
                        <tr key={participant.id} className="border-b last:border-0">
                          <td className="py-2">{idx + 1}</td>
                          <td className="py-2">{participant.user.nickname}</td>
                          <td className="py-2 text-center">
                            {league?.matches.filter(m => 
                              m.stage === 'QUALIFIER' && 
                              (m.player1.nickname === participant.user.nickname || 
                               m.player2.nickname === participant.user.nickname)
                            ).length || 0}
                          </td>
                          <td className="py-2 text-center text-blue-600">
                            {league?.matches.filter(m => 
                              m.stage === 'QUALIFIER' && 
                              m.winner?.nickname === participant.user.nickname
                            ).length || 0}
                          </td>
                          <td className="py-2 text-center text-red-600">
                            {league?.matches.filter(m => 
                              m.stage === 'QUALIFIER' && 
                              m.winner && 
                              m.winner.nickname !== participant.user.nickname &&
                              (m.player1.nickname === participant.user.nickname || 
                               m.player2.nickname === participant.user.nickname)
                            ).length || 0}
                          </td>
                          <td className="py-2 text-right font-semibold">
                            {participant.qualifierPoints || 0}
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* 예선 경기 결과 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">예선 경기 결과</h3>
            <div className="space-y-4">
              {league?.matches
                .filter(match => match.stage === 'QUALIFIER')
                .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
                .map(match => (
                  <div key={match.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                    <div className="text-sm text-gray-500 mb-2">
                      {new Date(match.matchDate).toLocaleDateString()} {new Date(match.matchDate).toLocaleTimeString()}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex-1 text-right">
                        <span className={`font-medium ${match.winner?.nickname === match.player1.nickname ? 'text-blue-600' : ''}`}>
                          {match.player1.nickname}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 px-6 mx-4">
                        <span className="text-2xl font-bold">{match.scorePlayer1}</span>
                        <span className="text-gray-400">:</span>
                        <span className="text-2xl font-bold">{match.scorePlayer2}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`font-medium ${match.winner?.nickname === match.player2.nickname ? 'text-blue-600' : ''}`}>
                          {match.player2.nickname}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 본선 현황 */}
      {activeTab === 'playoff' && (
        <div className="mt-6">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {league?.matches
                .filter(match => match.stage === 'PLAYOFF')
                .reduce((rounds, match) => {
                  if (!rounds[match.round]) rounds[match.round] = [];
                  rounds[match.round].push(match);
                  return rounds;
                }, [] as Array<typeof league.matches>)
                .reverse()
                .map((roundMatches, roundIndex, rounds) => (
                  <div key={roundIndex} className="flex">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-4 text-center">
                        {roundIndex === rounds.length - 1 ? '결승' :
                         roundIndex === rounds.length - 2 ? '준결승' :
                         `${Math.pow(2, rounds.length - roundIndex)}강`}
                      </h3>
                      <div className="space-y-8">
                        {roundMatches.map(match => (
                          <div key={match.id} 
                            className="mx-4 p-4 bg-white rounded-lg shadow relative"
                          >
                            <div className="flex flex-col space-y-2">
                              <div className={`p-2 ${match.winner?.nickname === match.player1.nickname ? 'bg-blue-50' : ''}`}>
                                <span className="font-medium">{match.player1.nickname}</span>
                                <span className="float-right font-bold">{match.scorePlayer1}</span>
                              </div>
                              <div className={`p-2 ${match.winner?.nickname === match.player2.nickname ? 'bg-blue-50' : ''}`}>
                                <span className="font-medium">{match.player2.nickname}</span>
                                <span className="float-right font-bold">{match.scorePlayer2}</span>
                              </div>
                            </div>
                            {roundIndex < rounds.length - 1 && (
                              <div className="absolute right-0 top-1/2 w-8 border-t-2 border-gray-300" 
                                style={{ transform: 'translateX(100%)' }} 
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 전체 결과 */}
      {activeTab === 'results' && (
        <div className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">최종 순위</h3>
            <div className="space-y-2">
              {league?.participants
                .sort((a, b) => (a.playoffRank || 999) - (b.playoffRank || 999))
                .map((participant, index) => (
                  <div key={participant.id} 
                    className={`flex justify-between items-center p-3 rounded ${
                      index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        index === 0 ? 'bg-yellow-400' :
                        index === 1 ? 'bg-gray-300' :
                        index === 2 ? 'bg-yellow-700' :
                        'bg-gray-100'
                      } text-white font-bold`}>
                        {index + 1}
                      </span>
                      <span className="font-medium">{participant.user.nickname}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {participant.playoffRank ? `${participant.playoffRank}위` : '미정'}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
