import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Developer } from '../../types';
import SkillBadge from '../common/SkillBadge';
import { FiGithub, FiLinkedin, FiMail, FiUser, FiX, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

interface DeveloperCardProps {
  developer: Developer;
}

export const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer }) => {
  const { currentUser, sendInvite, requests } = useAuth();
  const navigate = useNavigate();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [message, setMessage] = useState('');

  // Check if already invited
  const hasBeenInvited = requests.some(
    (req) => req.receiverId === developer.id && req.senderId === (currentUser?.id || 'user_current')
  );

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendInvite(developer.id, projectName, message);
    setShowInviteModal(false);
    setProjectName('');
    setMessage('');
  };

  // Safe split for developer name to address greeting fallback
  const firstName = (developer.name || '').trim().split(' ')[0] || 'there';

  // Safe avatar fallback URL
  const avatarUrl = developer.avatar || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(developer.name || "Developer")}&background=7c3aed&color=fff`;

  return (
    <>
      <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
        {/* Decorative corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-305"></div>
        
        <div>
          {/* Top section: Avatar & Name */}
          <div className="flex items-start space-x-4 mb-4">
            <img
              src={avatarUrl}
              alt={developer.name || "Developer Avatar"}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-800 shadow-md group-hover:border-brand-purple/50 transition-colors duration-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-purple-300 transition-colors duration-150">
                {developer.name || "Anonymous Builder"}
              </h3>
              <p className="text-xs text-purple-400 font-semibold mb-1">{developer.year || "Student Builder"}</p>
              <p className="text-xs text-zinc-400 font-medium truncate">{developer.college || "College / University"}</p>
            </div>
          </div>

          {/* Bio */}
          <p className="text-zinc-400 text-sm leading-relaxed mb-5 line-clamp-3">
            {developer.bio || "No biography provided yet."}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {(developer.skills || []).map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="pt-4 border-t border-zinc-800/60 mt-auto">
          <div className="flex items-center justify-between mb-4">
            {/* Social Links - Render only if URLs exist to prevent opening duplicate current page tabs */}
            <div className="flex space-x-2">
              {developer.github && (
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-all duration-200 hover:-translate-y-0.5"
                  title="GitHub"
                >
                  <FiGithub className="h-4 w-4" />
                </a>
              )}
              {developer.linkedin && (
                <a
                  href={developer.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-800 transition-all duration-200 hover:-translate-y-0.5"
                  title="LinkedIn"
                >
                  <FiLinkedin className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* View Profile */}
            <button
              onClick={() => navigate(`/profile/${developer.id}`)}
              className="flex items-center space-x-1.5 text-xs font-semibold text-zinc-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              <FiUser className="h-3.5 w-3.5" />
              <span>View Profile</span>
            </button>
          </div>

          {/* Invite Button - Prevent self-invitation */}
          {currentUser?.id === developer.id ? (
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-350 font-semibold rounded-xl text-sm hover:bg-zinc-800 hover:text-white transition-all cursor-pointer"
            >
              <FiUser className="h-4 w-4" />
              <span>Manage Profile</span>
            </button>
          ) : hasBeenInvited ? (
            <button
              disabled
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-zinc-900 border border-zinc-800 text-purple-400 font-semibold rounded-xl text-sm opacity-80"
            >
              <FiCheck className="h-4 w-4 text-purple-400" />
              <span>Invited</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (!currentUser) {
                  navigate('/login');
                } else {
                  setShowInviteModal(true);
                }
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-purple-600 hover:to-indigo-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-brand-purple/10 hover:shadow-brand-purple/20 transition-all duration-200 cursor-pointer"
            >
              <FiMail className="h-4 w-4" />
              <span>Invite to Team</span>
            </button>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-white mb-2">
              Invite {developer.name || "Developer"}
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Send a personalized message inviting them to join your hackathon or project team.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Project / Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CampusCart, HealthHack"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Personalized Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hey ${firstName}, I saw you are skilled in ${(developer.skills || []).slice(0, 3).join(', ')}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm resize-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-2.5 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-brand-purple/20 transition-all cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DeveloperCard;
