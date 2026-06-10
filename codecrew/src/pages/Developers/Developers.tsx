import React, { useState, useMemo } from 'react';
import { mockDevelopers } from '../../data/mockDevelopers';
import SearchBar from '../../components/common/SearchBar';
import SkillBadge from '../../components/common/SkillBadge';
import DeveloperCard from '../../components/developers/DeveloperCard';
import { FiSliders, FiXCircle } from 'react-icons/fi';

// Extract all unique skills and colleges from mock data for filters
const ALL_SKILLS = Array.from(
  new Set(mockDevelopers.flatMap((dev) => dev.skills))
).sort();

const ALL_COLLEGES = Array.from(
  new Set(mockDevelopers.map((dev) => dev.college))
).sort();

export const Developers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCollege('');
    setSelectedSkills([]);
  };

  // Memoized filter logic
  const filteredDevelopers = useMemo(() => {
    return mockDevelopers.filter((dev) => {
      // 1. Text Search query filter
      const matchesSearch =
        searchQuery === '' ||
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      // 2. College filter
      const matchesCollege = selectedCollege === '' || dev.college === selectedCollege;

      // 3. Skills filter (developer must have all selected skills)
      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => dev.skills.includes(skill));

      return matchesSearch && matchesCollege && matchesSkills;
    });
  }, [searchQuery, selectedCollege, selectedSkills]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-extrabold text-white tracking-tight">
          Explore Student <span className="gradient-text">Developers</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Search profiles, filter by colleges and skills, and invite them to form your perfect project crew.
        </p>
      </div>

      {/* Search Bar & Advanced Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="flex-1 w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-3 border rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
            showFilters || selectedCollege || selectedSkills.length > 0
              ? 'border-brand-purple/50 bg-brand-purple/10 text-purple-300'
              : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white hover:border-zinc-700'
          }`}
        >
          <FiSliders className="h-4 w-4" />
          <span>Filters {selectedSkills.length + (selectedCollege ? 1 : 0) > 0 && `(${selectedSkills.length + (selectedCollege ? 1 : 0)})`}</span>
        </button>
      </div>

      {/* Advanced Filter Drawer */}
      {(showFilters || selectedCollege || selectedSkills.length > 0) && (
        <div className="glass-panel border border-zinc-800/80 rounded-2xl p-6 max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">Advanced Filters</h3>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* College Dropdown Filter */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Filter by College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple text-sm appearance-none cursor-pointer"
              >
                <option value="">All Colleges</option>
                {ALL_COLLEGES.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Skills selection filter */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Filter by Skills (must match all selected)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SKILLS.map((skill) => (
                <SkillBadge
                  key={skill}
                  skill={skill}
                  onClick={() => handleSkillToggle(skill)}
                  selected={selectedSkills.includes(skill)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Stats / Results */}
      <div className="max-w-7xl mx-auto flex items-center justify-between text-zinc-550 text-xs font-semibold pt-4">
        <span>Found {filteredDevelopers.length} student developers</span>
        {(selectedCollege || selectedSkills.length > 0 || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="text-brand-purple hover:underline cursor-pointer"
          >
            Clear active query
          </button>
        )}
      </div>

      {/* Main Grid */}
      {filteredDevelopers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredDevelopers.map((dev) => (
            <div key={dev.id} className="h-full">
              <DeveloperCard developer={dev} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <div className="mx-auto h-16 w-16 text-zinc-650 flex items-center justify-center">
            <FiXCircle className="h-12 w-12" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">No Developers Found</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We couldn't find anyone matching your current search options. Try adjusting your skills tags or searching for a different keyword.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Developers;
