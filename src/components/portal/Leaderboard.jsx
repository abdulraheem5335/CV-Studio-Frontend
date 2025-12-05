import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { 
  useTheme,
  GoldMedalIcon, SilverMedalIcon, BronzeMedalIcon, TrophyIcon,
  SpinnerIcon, UserIcon, StarIcon, CoinIcon
} from '../ui';

const Leaderboard = () => {
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('xp');
  const [timeframe, setTimeframe] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [type, timeframe]);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/users/leaderboard', { params: { type, limit: 50 } });
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <GoldMedalIcon size={24} />;
    if (rank === 2) return <SilverMedalIcon size={24} />;
    if (rank === 3) return <BronzeMedalIcon size={24} />;
    return `#${rank}`;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return { background: `linear-gradient(135deg, ${theme.colorPalette.coins}20, ${theme.colorPalette.primary}20)`, border: `1px solid ${theme.colorPalette.coins}50` };
    if (rank === 2) return { background: theme.colorPalette.surface, border: `1px solid ${theme.colorPalette.text.muted}30` };
    if (rank === 3) return { background: `${theme.colorPalette.secondary}15`, border: `1px solid ${theme.colorPalette.secondary}30` };
    return { background: theme.colorPalette.surface, border: `1px solid ${theme.colorPalette.primary}10` };
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2" style={{ color: theme.colorPalette.text.primary }}>
          <TrophyIcon size={28} color={theme.colorPalette.coins} /> Leaderboard
        </h1>
        <p style={{ color: theme.colorPalette.text.muted }}>Top explorers of NUST Campus</p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex gap-2 rounded-xl p-1" style={{ background: theme.colorPalette.surface }}>
          {['xp', 'points'].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className="px-4 py-2 rounded-lg transition flex items-center gap-2"
              style={{
                background: type === t 
                  ? `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})`
                  : 'transparent',
                color: type === t ? '#fff' : theme.colorPalette.text.secondary,
              }}
            >
              {t === 'xp' ? <><StarIcon size={16} /> XP</> : <><CoinIcon size={16} /> Points</>}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <SpinnerIcon size={40} color={theme.colorPalette.primary} />
          <p className="mt-2" style={{ color: theme.colorPalette.text.muted }}>Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 rounded-xl" style={{ background: theme.colorPalette.surface }}>
          <TrophyIcon size={40} color={theme.colorPalette.text.muted} className="mx-auto mb-2" />
          <p style={{ color: theme.colorPalette.text.muted }}>No rankings yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center mt-8"
            >
              {leaderboard[1] && (
                <>
                  <div 
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{ background: `linear-gradient(135deg, ${theme.colorPalette.text.muted}, ${theme.colorPalette.surface})` }}
                  >
                    <UserIcon size={28} color="#fff" />
                  </div>
                  <SilverMedalIcon size={28} className="mx-auto" />
                  <div className="font-semibold truncate" style={{ color: theme.colorPalette.text.primary }}>{leaderboard[1].nickname}</div>
                  <div className="text-sm" style={{ color: theme.colorPalette.text.muted }}>Lvl {leaderboard[1].level}</div>
                  <div className="font-bold" style={{ color: theme.colorPalette.primary }}>
                    {type === 'xp' ? leaderboard[1].xp : leaderboard[1].points}
                  </div>
                </>
              )}
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {leaderboard[0] && (
                <>
                  <div 
                    className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-2 ring-4"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colorPalette.coins}, ${theme.colorPalette.secondary})`,
                      boxShadow: `0 0 20px ${theme.colorPalette.coins}40`
                    }}
                  >
                    <UserIcon size={36} color="#fff" />
                  </div>
                  <GoldMedalIcon size={32} className="mx-auto" />
                  <div className="font-bold text-lg truncate" style={{ color: theme.colorPalette.text.primary }}>{leaderboard[0].nickname}</div>
                  <div className="text-sm" style={{ color: theme.colorPalette.text.muted }}>Lvl {leaderboard[0].level}</div>
                  <div className="font-bold text-xl" style={{ color: theme.colorPalette.coins }}>
                    {type === 'xp' ? leaderboard[0].xp : leaderboard[0].points}
                  </div>
                </>
              )}
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-12"
            >
              {leaderboard[2] && (
                <>
                  <div 
                    className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-2"
                    style={{ background: `linear-gradient(135deg, ${theme.colorPalette.secondary}, ${theme.colorPalette.secondary}80)` }}
                  >
                    <UserIcon size={24} color="#fff" />
                  </div>
                  <BronzeMedalIcon size={24} className="mx-auto" />
                  <div className="font-semibold truncate" style={{ color: theme.colorPalette.text.primary }}>{leaderboard[2].nickname}</div>
                  <div className="text-sm" style={{ color: theme.colorPalette.text.muted }}>Lvl {leaderboard[2].level}</div>
                  <div className="font-bold" style={{ color: theme.colorPalette.secondary }}>
                    {type === 'xp' ? leaderboard[2].xp : leaderboard[2].points}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Rest of leaderboard */}
          {leaderboard.slice(3).map((user, index) => (
            <motion.div
              key={user.id || user._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl flex items-center gap-4"
              style={getRankStyle(index + 4)}
            >
              <div className="w-8 text-center font-bold" style={{ color: theme.colorPalette.text.muted }}>
                {getRankIcon(index + 4)}
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${theme.colorPalette.primary}, ${theme.colorPalette.secondary})` }}
              >
                <UserIcon size={20} color="#fff" />
              </div>
              <div className="flex-1">
                <div className="font-medium" style={{ color: theme.colorPalette.text.primary }}>{user.nickname}</div>
                <div className="text-sm" style={{ color: theme.colorPalette.text.muted }}>Level {user.level}</div>
              </div>
              <div className="text-right">
                <div 
                  className="font-bold"
                  style={{ color: type === 'xp' ? theme.colorPalette.primary : theme.colorPalette.coins }}
                >
                  {type === 'xp' ? user.xp : user.points}
                </div>
                <div className="text-xs" style={{ color: theme.colorPalette.text.muted }}>{type === 'xp' ? 'XP' : 'Points'}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
