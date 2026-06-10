import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockDevelopers } from '../../data/mockDevelopers';
import SkillBadge from '../../components/common/SkillBadge';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiCheckCircle, FiXCircle, FiTrendingUp, FiLayers, FiMessageSquare, FiExternalLink } from 'react-icons/fi';

export const Dashboard: React.FC = () => {
  const { currentUser, requests, respondToInvite } = useAuth();
  const navigate = useNavigate();

  // Filter requests
  const incomingRequests = useMemo(() => {
    return requests.filter(req => req.receiverId === currentUser?.id);
  }, [requests, currentUser]);

  const outgoingRequests = useMemo(() => {
    return requests.filter(req => req.senderId === currentUser?.id);
  }, [requests, currentUser]);

  // Teammate recommendations based on skills overlap (having at least 1 skill in common)
  const suggestedTeammates = useMemo(() => {
    if (!currentUser || !currentUser.skills) return mockDevelopers.slice(0, 3);
    
    return mockDevelopers
      .filter(dev => dev.id !== currentUser.id)
      .map(dev => {
        // Count overlapping skills
        const overlapping = dev.skills.filter(s => currentUser.skills?.includes(s));
        return { dev, score: overlapping.length };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.dev);
  }, [currentUser]);

  return (
    <div className="space-y-8 py-4">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Hey, {currentUser?.name || 'Developer'}!
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage your invitations, check teammate matches, and launch your project.
          </p>
        </div>
        <div>
          <Link
            to="/developers"
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-brand-purple/20 transition-all duration-200 cursor-pointer"
          >
            <span>Search Developers</span>
          </Link>
        </div>
      </div>

      {/* Analytics Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel border border-zinc-800/60 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-brand-purple/10 text-purple-400 rounded-xl">
            <FiMail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Pending Invites</p>
            <p className="text-2xl font-bold text-white mt-1">
              {incomingRequests.filter(r => r.status === 'pending').length}
            </p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/60 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-brand-pink/10 text-pink-400 rounded-xl">
            <FiLayers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Sent Requests</p>
            <p className="text-2xl font-bold text-white mt-1">{outgoingRequests.length}</p>
          </div>
        </div>

        <div className="glass-panel border border-zinc-800/60 rounded-2xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <FiTrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Acceptance Rate</p>
            <p className="text-2xl font-bold text-white mt-1">
              {outgoingRequests.length > 0 
                ? `${Math.round((outgoingRequests.filter(r => r.status === 'accepted').length / outgoingRequests.length) * 100)}%` 
                : '0%'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Invitations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incoming invitations */}
          <div className="glass-panel border border-zinc-800/60 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white">Incoming Invitations</h2>
            
            {incomingRequests.length > 0 ? (
              <div className="space-y-4">
                {incomingRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="border border-zinc-800/80 bg-zinc-950/40 p-4 rounded-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <img 
                        src={req.senderAvatar} 
                        alt={req.senderName} 
                        className="h-10 w-10 rounded-xl object-cover border border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/${req.senderId}`} className="text-sm font-bold text-white hover:text-purple-300 transition-colors">
                            {req.senderName}
                          </Link>
                          <span className="text-[10px] text-zinc-550 font-medium">
                            {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-purple-400 font-semibold mt-0.5">
                          Invited you to: {req.projectName}
                        </p>
                      </div>
                    </div>

                    <p className="text-zinc-400 text-xs leading-relaxed italic bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                      "{req.message}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {req.status}
                      </span>

                      {req.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => respondToInvite(req.id, 'declined')}
                            className="flex items-center space-x-1.5 px-3 py-1.5 border border-zinc-850 hover:border-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <FiXCircle className="h-3.5 w-3.5" />
                            <span>Decline</span>
                          </button>
                          <button
                            onClick={() => respondToInvite(req.id, 'accepted')}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-brand-purple hover:bg-purple-650 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <FiCheckCircle className="h-3.5 w-3.5" />
                            <span>Accept</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-zinc-800/80 rounded-xl space-y-2">
                <FiMessageSquare className="h-8 w-8 text-zinc-600 mx-auto" />
                <p className="text-zinc-400 text-sm font-semibold">No incoming requests yet.</p>
                <p className="text-zinc-500 text-xs">When other student builders invite you, they will show up here.</p>
              </div>
            )}
          </div>

          {/* Outgoing invitations */}
          <div className="glass-panel border border-zinc-800/60 rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-white">Sent Invitations</h2>
            
            {outgoingRequests.length > 0 ? (
              <div className="space-y-3">
                {outgoingRequests.map((req) => {
                  const receiver = mockDevelopers.find(d => d.id === req.receiverId);
                  return (
                    <div 
                      key={req.id} 
                      className="flex items-center justify-between p-3 border border-zinc-800/80 bg-zinc-950/20 rounded-xl text-sm"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <img 
                          src={receiver?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'} 
                          alt={receiver?.name || 'Developer'} 
                          className="h-8 w-8 rounded-lg object-cover border border-zinc-800"
                        />
                        <div className="min-w-0">
                          <Link to={`/profile/${req.receiverId}`} className="font-bold text-white hover:text-purple-300 transition-colors truncate block">
                            {receiver?.name || 'Student Builder'}
                          </Link>
                          <p className="text-[10px] text-zinc-500 font-semibold truncate">
                            Project: {req.projectName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          req.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-zinc-800/80 rounded-xl">
                <p className="text-zinc-500 text-xs font-semibold">You haven't sent any invites yet. Go search developers and recruit them!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Suggested Matches */}
        <div className="space-y-6">
          <div className="glass-panel border border-zinc-800/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-white">Recommended Matches</h2>
              <span className="text-[10px] text-purple-400 font-semibold bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                By Skills
              </span>
            </div>

            <div className="space-y-4">
              {suggestedTeammates.map((dev) => (
                <div 
                  key={dev.id} 
                  className="border border-zinc-800/60 bg-zinc-950/20 p-4 rounded-xl space-y-3 hover:border-brand-purple/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={dev.avatar} 
                      alt={dev.name} 
                      className="h-9 w-9 rounded-lg object-cover border border-zinc-800"
                    />
                    <div className="min-w-0 flex-1">
                      <Link to={`/profile/${dev.id}`} className="text-xs font-bold text-white hover:text-purple-300 transition-colors block truncate">
                        {dev.name}
                      </Link>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">{dev.college}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {dev.skills.slice(0, 3).map((skill) => (
                      <SkillBadge key={skill} skill={skill} />
                    ))}
                    {dev.skills.length > 3 && (
                      <span className="text-[10px] text-zinc-550 font-semibold px-2 py-1 bg-zinc-900 rounded-full">
                        +{dev.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-zinc-850">
                    <button 
                      onClick={() => navigate(`/profile/${dev.id}`)}
                      className="flex items-center space-x-1 text-[10px] font-bold text-zinc-400 hover:text-purple-400 transition-colors cursor-pointer"
                    >
                      <span>View Profile</span>
                      <FiExternalLink className="h-3 w-3" />
                    </button>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      High Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
