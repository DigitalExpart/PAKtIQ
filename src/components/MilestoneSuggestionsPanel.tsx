import { useState } from 'react';
import { Lightbulb, Calendar, Plus, Check } from 'lucide-react';
import { getMilestoneSuggestions, calculateMilestoneDate } from '../utils/milestoneSuggestions';

interface MilestoneSuggestionsPanelProps {
  resolutionCategory: string;
  resolutionCreatedAt: string;
  resolutionTargetDate: string;
  onSelectSuggestion: (title: string, description: string, reminderDate?: string) => void;
  onSelectMultiple?: (suggestions: Array<{ title: string; description: string; reminderDate?: string }>) => void;
}

export function MilestoneSuggestionsPanel({
  resolutionCategory,
  resolutionCreatedAt,
  resolutionTargetDate,
  onSelectSuggestion,
  onSelectMultiple
}: MilestoneSuggestionsPanelProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const suggestions = getMilestoneSuggestions(resolutionCategory);

  const formatWeekInfo = (weekNumber: number) => {
    const now = new Date();
    const target = new Date(resolutionTargetDate);
    const totalWeeks = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 7));
    
    if (weekNumber > totalWeeks) {
      return `Week ${Math.min(weekNumber, Math.floor(totalWeeks))}`;
    }
    return `Week ${weekNumber}`;
  };

  const formatMilestoneDate = (weekNumber: number) => {
    const suggestedDate = calculateMilestoneDate(
      resolutionCreatedAt,
      resolutionTargetDate,
      weekNumber
    );
    const date = new Date(suggestedDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getTimeFromNow = (weekNumber: number) => {
    const suggestedDate = calculateMilestoneDate(
      resolutionCreatedAt,
      resolutionTargetDate,
      weekNumber
    );
    const date = new Date(suggestedDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Past due';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `in ${diffDays} days`;
    if (diffDays < 30) return `in ${Math.ceil(diffDays / 7)} weeks`;
    if (diffDays < 365) return `in ${Math.ceil(diffDays / 30)} months`;
    return `in ${Math.ceil(diffDays / 365)} years`;
  };

  const toggleSelection = (index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const handleAddSelected = () => {
    if (selectedIndices.size === 0) return;

    const milestonesToAdd = Array.from(selectedIndices).map(index => {
      const suggestion = suggestions[index];
      const suggestedDate = calculateMilestoneDate(
        resolutionCreatedAt,
        resolutionTargetDate,
        suggestion.suggestedWeek
      );
      
      const reminderDateTime = new Date(suggestedDate);
      reminderDateTime.setHours(9, 0, 0, 0);
      
      return {
        title: suggestion.title,
        description: suggestion.description,
        reminderDate: reminderDateTime.toISOString().slice(0, 16)
      };
    });

    if (onSelectMultiple) {
      onSelectMultiple(milestonesToAdd);
    } else {
      // Fallback to adding one by one
      milestonesToAdd.forEach(milestone => {
        onSelectSuggestion(milestone.title, milestone.description, milestone.reminderDate);
      });
    }

    setSelectedIndices(new Set());
  };

  const handleSelect = (index: number, suggestion: typeof suggestions[0]) => {
    const suggestedDate = calculateMilestoneDate(
      resolutionCreatedAt,
      resolutionTargetDate,
      suggestion.suggestedWeek
    );
    
    const reminderDateTime = new Date(suggestedDate);
    reminderDateTime.setHours(9, 0, 0, 0);
    
    onSelectSuggestion(
      suggestion.title,
      suggestion.description,
      reminderDateTime.toISOString().slice(0, 16)
    );
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-xl">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-gray-800">Smart Milestone Suggestions</h3>
            <p className="text-xs text-gray-600">
              {selectedIndices.size > 0
                ? `${selectedIndices.size} selected - click "Add Selected" to add them`
                : 'Select multiple or click + to add one'
              }
            </p>
          </div>
        </div>

        {selectedIndices.size > 0 && (
          <button
            onClick={handleAddSelected}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all text-sm animate-in fade-in slide-in-from-right-5"
          >
            <Plus className="w-4 h-4" />
            Add {selectedIndices.size}
          </button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {suggestions.slice(0, 8).map((suggestion, index) => {
          const isSelected = selectedIndices.has(index);
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 transition-all border ${
                isSelected
                  ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                  : 'border-purple-100 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelection(index)}
                  className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-600'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </button>

                {/* Content */}
                <div className="flex-1">
                  <h4 className={`text-sm mb-1 transition-colors ${
                    isSelected ? 'text-purple-700' : 'text-gray-800'
                  }`}>
                    {suggestion.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-purple-600" />
                      <span className="text-purple-700">
                        {formatMilestoneDate(suggestion.suggestedWeek)}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {getTimeFromNow(suggestion.suggestedWeek)}
                    </span>
                    <span className="text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                      {formatWeekInfo(suggestion.suggestedWeek)}
                    </span>
                  </div>
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleSelect(index, suggestion)}
                  className="bg-purple-100 hover:bg-purple-600 p-2 rounded-xl transition-all group"
                  title="Add this milestone"
                >
                  <Plus className="w-4 h-4 text-purple-600 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedIndices.size > 0 && (
        <div className="mt-4 p-3 bg-white rounded-xl border border-purple-200 flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {selectedIndices.size} milestone{selectedIndices.size !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setSelectedIndices(new Set())}
            className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
}
