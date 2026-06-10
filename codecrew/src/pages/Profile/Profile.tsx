import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockDevelopers } from '../../data/mockDevelopers';
import SkillBadge from '../../components/common/SkillBadge';
import { FiGithub, FiLinkedin, FiMail, FiEdit3, FiSave, FiX, FiCheck, FiArrowLeft } from 'react-icons/fi';
import type { Developer } from '../../types';

export const Profile: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { currentUser, updateProfile, sendInvite, requests } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteProjectName, setInviteProjectName] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // Editable fields for own profile
  const [editName, setEditName] = useState('');
  const [editCollege, setEditCollege] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editSkills, setEditSkills] = useState<string[]>([]);

  // Determine which profile to display
  const profileData = useMemo(() => {
    if (id) {
      // Find developer in mock list
      return mockDevelopers.find(dev => dev.id === id) || null;
    }
    // Else show current user
    if (currentUser) {
      const mappedDev: Developer = {
        id: currentUser.id,
        name: currentUser.name,
        college: currentUser.college || 'Stanford University',
        year: currentUser.year || 'Senior (4th Year)',
        skills: currentUser.skills || [],
        bio: currentUser.bio || 'Product builder and designer.',
        github: currentUser.github || 'https://github.com',
        linkedin: currentUser.linkedin || 'https://linkedin.com',
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
      };
      return mappedDev;
    }
    return null;
  }, [id, currentUser]);

  // Sync edit form on edit toggle or profile load
  useEffect(() => {
    if (profileData && !id) {
      setEditName(profileData.name);
      setEditCollege(profileData.college);
      setEditYear(profileData.year);
      setEditBio(profileData.bio);
      setEditGithub(profileData.github);
      setEditLinkedin(profileData.linkedin);
      setEditSkills(profileData.skills);
    }
  }, [profileData, id, isEditing]);

  if (!profileData) {
    return (
      <div className="text-center py-24 space-y-4">
        <h2 className="text-xl font-bold text-white">Profile Not Found</h2>
        <p className="text-zinc-400 text-sm">We couldn't load the requested user details.</p>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-zinc-900 border border-zinc-850 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all cursor-pointer"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isOwnProfile = !id || id === currentUser?.id;

  // Check if invited
  const hasBeenInvited = requests.some(
    (req) => req.receiverId === profileData.id && req.senderId === (currentUser?.id || 'user_current')
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      college: editCollege,
      year: editYear,
      bio: editBio,
      github: editGithub,
      linkedin: editLinkedin,
      skills: editSkills
    });
    setIsEditing(false);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendInvite(profileData.id, inviteProjectName, inviteMessage);
    setShowInviteModal(false);
    setInviteProjectName('');
    setInviteMessage('');
  };

  const toggleEditSkill = (skill: string) => {
    setEditSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Back link if visiting someone else */}
      {id && (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
        >
          <FiArrowLeft className="h-4 w-4" />
          <span>Back to Developers</span>
        </button>
      )}

      {/* Main Profile Card */}
      <div className="glass-panel border border-zinc-800/80 rounded-3xl overflow-hidden relative shadow-2xl">
        {/* Banner banner background gradient */}
        <div className="h-40 bg-gradient-to-r from-brand-purple/20 via-brand-indigo/20 to-brand-pink/20 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 md:px-8 pb-8 relative">
          {/* Avatar and Row Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6 gap-4">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-32 h-32 rounded-3xl object-cover border-4 border-zinc-950 shadow-xl relative z-10"
            />
            
            <div className="flex items-center space-x-3 pt-2">
              {isOwnProfile ? (
                isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-1.5 px-4 py-2 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <FiX className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                    >
                      <FiSave className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <FiEdit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )
              ) : (
                hasBeenInvited ? (
                  <button
                    disabled
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-purple-400 font-bold rounded-xl text-xs"
                  >
                    <FiCheck className="h-4 w-4" />
                    <span>Invited to Team</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!currentUser) navigate('/login');
                      else setShowInviteModal(true);
                    }}
                    className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-purple/20 transition-all cursor-pointer"
                  >
                    <FiMail className="h-4 w-4" />
                    <span>Invite to Team</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Profile Data Display / Edit Mode */}
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Display Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">College</label>
                    <input
                      type="text"
                      required
                      value={editCollege}
                      onChange={(e) => setEditCollege(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Year</label>
                    <input
                      type="text"
                      required
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={editGithub}
                      onChange={(e) => setEditGithub(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      value={editLinkedin}
                      onChange={(e) => setEditLinkedin(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-2">Bio</label>
                <textarea
                  rows={4}
                  required
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm resize-none"
                />
              </div>

              {/* Skills edit tags */}
              <div className="border-t border-zinc-800/60 pt-4">
                <label className="block text-xs font-semibold text-zinc-400 uppercase mb-3">Modify Skills</label>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'PyTorch', 'Figma', 'UI/UX Design', 'Swift', 'Rust', 'Go'].map(skill => (
                    <SkillBadge
                      key={skill}
                      skill={skill}
                      onClick={() => toggleEditSkill(skill)}
                      selected={editSkills.includes(skill)}
                    />
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">{profileData.name}</h2>
                <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-sm text-zinc-400">
                  <span>{profileData.year}</span>
                  <span className="hidden sm:inline text-zinc-650">•</span>
                  <span>{profileData.college}</span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="border-t border-zinc-800/60 pt-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">About Me</h3>
                <p className="text-zinc-350 text-sm leading-relaxed whitespace-pre-line">{profileData.bio}</p>
              </div>

              {/* Skills Section */}
              <div className="border-t border-zinc-800/60 pt-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Tech Stack & Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.skills.map(skill => (
                    <SkillBadge key={skill} skill={skill} />
                  ))}
                </div>
              </div>

              {/* Portfolio & Socials Links */}
              <div className="border-t border-zinc-800/60 pt-6 flex items-center space-x-6">
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <FiGithub className="h-5 w-5" />
                  <span className="font-semibold">GitHub</span>
                </a>
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <FiLinkedin className="h-5 w-5" />
                  <span className="font-semibold">LinkedIn</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-850 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-white mb-2">
              Invite {profileData.name}
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
                  value={inviteProjectName}
                  onChange={(e) => setInviteProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Personalized Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={`Hey ${profileData.name.split(' ')[0]}, I saw you are skilled in ${profileData.skills.slice(0, 3).join(', ')}...`}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm resize-none"
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
                  className="flex-1 py-2.5 bg-gradient-to-r from-brand-purple to-brand-indigo text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
