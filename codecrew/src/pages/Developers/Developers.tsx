import React, { useState, useMemo, useEffect, useCallback } from "react";
import { getAllUsers } from "../../services/userService";
import type { UserResponseData } from "../../services/userService";
import type { Developer } from "../../types";

import SearchBar from "../../components/common/SearchBar";
import SkillBadge from "../../components/common/SkillBadge";
import DeveloperCard from "../../components/developers/DeveloperCard";
import { FiSliders, FiXCircle, FiLoader } from "react-icons/fi";

export const Developers: React.FC = () => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch developers from backend on mount
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const users: UserResponseData[] = await getAllUsers();

        const mapped: Developer[] = users.map((user: UserResponseData) => ({
          id: user.id,
          name: user.name || "",
          college: user.college || "",
          year: user.year || "",
          skills: Array.isArray(user.skills) ? user.skills : [],
          bio: user.bio || "",
          github: user.github || "",
          linkedin: user.linkedin || "",
          avatar:
            user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "Developer")}&background=7c3aed&color=fff`,
        }));

        setDevelopers(mapped);
      } catch (err: any) {
        setError(
          err?.message ?? "Failed to load developers. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  // Derive filter options dynamically from fetched data, filtering out empty values
  const ALL_SKILLS = useMemo(
    () => Array.from(new Set(developers.flatMap((dev) => dev.skills).filter(Boolean))).sort(),
    [developers]
  );

  const ALL_COLLEGES = useMemo(
    () => Array.from(new Set(developers.map((dev) => dev.college).filter(Boolean))).sort(),
    [developers]
  );

  const handleSkillToggle = useCallback((skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedCollege("");
    setSelectedSkills([]);
  }, []);

  // Memoized filter logic
  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      const matchesSearch =
        searchQuery === "" ||
        dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dev.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCollege =
        selectedCollege === "" || dev.college === selectedCollege;

      const matchesSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((skill) => dev.skills.includes(skill));

      return matchesSearch && matchesCollege && matchesSkills;
    });
  }, [developers, searchQuery, selectedCollege, selectedSkills]);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-extrabold text-white tracking-tight">
          Explore Student <span className="gradient-text">Developers</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Search profiles, filter by colleges and skills, and invite them to
          form your perfect project crew.
        </p>
      </div>

      {/* Search Bar & Advanced Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
        <div className="flex-1 w-full">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full md:w-auto flex items-center justify-center space-x-2 px-5 py-3 border rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${showFilters || selectedCollege || selectedSkills.length > 0
            ? "border-brand-purple/50 bg-brand-purple/10 text-purple-300"
            : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:text-white hover:border-zinc-700"
            }`}
        >
          <FiSliders className="h-4 w-4" />
          <span>
            Filters{" "}
            {selectedSkills.length + (selectedCollege ? 1 : 0) > 0 &&
              `(${selectedSkills.length + (selectedCollege ? 1 : 0)})`}
          </span>
        </button>
      </div>

      {/* Advanced Filter Drawer */}
      {(showFilters || selectedCollege || selectedSkills.length > 0) && (
        <div className="glass-panel border border-zinc-800/80 rounded-2xl p-6 max-w-3xl mx-auto space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h3 className="font-bold text-sm text-white uppercase tracking-wider">
              Advanced Filters
            </h3>
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <FiLoader className="h-10 w-10 text-brand-purple animate-spin" />
          <p className="text-zinc-400 text-sm font-medium">
            Loading developers...
          </p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="text-center py-20 max-w-md mx-auto space-y-4">
          <div className="mx-auto h-16 w-16 text-red-500 flex items-center justify-center">
            <FiXCircle className="h-12 w-12" />
          </div>
          <h3 className="font-display text-lg font-bold text-white">
            Something went wrong
          </h3>
          <p className="text-zinc-400 text-sm leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Results — only shown when not loading and no error */}
      {!isLoading && !error && (
        <>
          {/* Search Stats */}
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
              <h3 className="font-display text-lg font-bold text-white">
                No Developers Found
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                We couldn't find anyone matching your current search options.
                Try adjusting your skills tags or searching for a different
                keyword.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm font-semibold hover:bg-zinc-800 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Developers;