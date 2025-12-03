import { Filter, ArrowUpDown, Sparkles } from 'lucide-react';

interface FilterSortProps {
  filterCategory: string;
  sortBy: 'recent' | 'progress' | 'deadline';
  onFilterChange: (category: string) => void;
  onSortChange: (sort: 'recent' | 'progress' | 'deadline') => void;
}

export function FilterSort({ filterCategory, sortBy, onFilterChange, onSortChange }: FilterSortProps) {
  const categories = [
    { value: 'all', label: 'All', emoji: '🌈' },
    { value: 'health', label: 'Health', emoji: '💪' },
    { value: 'finance', label: 'Finance', emoji: '💰' },
    { value: 'career', label: 'Career', emoji: '🎯' },
    { value: 'personal', label: 'Personal', emoji: '🌟' },
    { value: 'education', label: 'Education', emoji: '📚' },
    { value: 'relationships', label: 'Relations', emoji: '❤️' },
    { value: 'other', label: 'Other', emoji: '✨' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'progress', label: 'Progress' },
    { value: 'deadline', label: 'Deadline' }
  ];

  return (
    <div className="space-y-3">
      {/* Category Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-xl">
            <Filter className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-800">Filter by Category</span>
          <Sparkles className="w-3 h-3 text-purple-500 ml-auto" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => onFilterChange(cat.value)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs transition-all ${
                filterCategory === cat.value
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 hover:from-purple-50 hover:to-pink-50 border border-gray-200'
              }`}
            >
              <span className="mr-1.5 text-base">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-lg border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 rounded-xl">
            <ArrowUpDown className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-800">Sort by</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {sortOptions.map(option => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value as any)}
              className={`px-3 py-3 rounded-2xl text-xs transition-all ${
                sortBy === option.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 hover:from-blue-50 hover:to-indigo-50 border border-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
