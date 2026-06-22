import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiLock, FiBook, FiBriefcase, FiGithub, FiLinkedin, FiAlertCircle } from 'react-icons/fi';
import SkillBadge from '../../components/common/SkillBadge';

const AVAILABLE_SKILLS = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PyTorch', 'TensorFlow',
    'Figma', 'UI/UX Design', 'Swift', 'Kotlin', 'Rust', 'Go',
    'Docker', 'Kubernetes', 'AWS', 'Web3', 'Solidity', 'SQL', 'MongoDB'
];

/**
 * Register Component
 * Handles new student profile registration, skill selection, and social link integration.
 */
export const Register: React.FC = () => {
    const { register, currentUser } = useAuth();
    const navigate = useNavigate();

    // Form Field States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [college, setCollege] = useState('');
    const [year, setYear] = useState('Freshman (1st Year)');
    const [bio, setBio] = useState('');
    const [github, setGithub] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // Status States
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Redirect if user is already authenticated
    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    // Toggle a skill in the tech stack selection list
    const handleSkillToggle = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    // Submit profile details to registration service
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !password || !college) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsLoading(true);

        try {
            const success = await register({
                name,
                email,
                password,
                college,
                year,
                skills: selectedSkills,
                bio: bio.trim() || undefined,
                github: github.trim() || undefined,
                linkedin: linkedin.trim() || undefined,
            });

            if (success) {
                navigate('/dashboard');
            } else {
                setError('Registration failed. Please check your credentials and try again.');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.data?.message ||
                    'Registration failed. Please try again.'
                );
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[90vh] py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl space-y-8 glass-panel border border-zinc-800/80 rounded-3xl p-8 relative overflow-hidden shadow-2xl animate-fade-in">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-brand-indigo/10 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                        CC
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight font-display">
                        Create Your Profile
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                        Join CodeCrew and find your next project partners.
                    </p>
                </div>

                {error && (
                    <div className="flex items-center space-x-2 bg-red-950/40 border border-red-500/20 text-red-300 p-4 rounded-xl text-sm transition-all duration-200">
                        <FiAlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column - Core Auth & College details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Alex Mercer"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-colors duration-155"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="alex@college.edu"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-colors duration-155"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-colors duration-155"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    College / University <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiBook className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. UC Berkeley"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-colors duration-155"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Year of Study
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiBriefcase className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                                        <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                                        <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                                        <option value="Senior (4th Year)">Senior (4th Year)</option>
                                        <option value="Graduate Student">Graduate Student</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Profile Metadata & Social links */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Short Bio
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell potential teammates about your interests, what you like to build, and previous hackathon experience."
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm resize-none transition-colors duration-155"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    GitHub Profile Link
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiGithub className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/username"
                                        value={github}
                                        onChange={(e) => setGithub(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-colors duration-155"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    LinkedIn Profile Link
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <FiLinkedin className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm transition-colors duration-155"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tech Stack / Skills section */}
                    <div className="border-t border-zinc-800/60 pt-6">
                        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                            Select Your Tech Stack / Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {AVAILABLE_SKILLS.map((skill) => (
                                <SkillBadge
                                    key={skill}
                                    skill={skill}
                                    onClick={() => handleSkillToggle(skill)}
                                    selected={selectedSkills.includes(skill)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Form submission footer */}
                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                        <p className="text-xs text-zinc-500 font-semibold">
                            * Required fields
                        </p>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-gradient-to-r from-brand-purple to-brand-indigo hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-brand-purple/20 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Profile...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-2 border-t border-zinc-900">
                    <p className="text-sm text-zinc-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;