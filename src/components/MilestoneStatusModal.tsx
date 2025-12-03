import { useState } from 'react';
import { X, CheckCircle2, SkipForward, XCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { Milestone } from '../App';

interface MilestoneStatusModalProps {
  milestone: Milestone;
  onClose: () => void;
  onStatusChange: (status: 'completed' | 'skipped' | 'disregarded', reason?: string) => void;
}

export function MilestoneStatusModal({ milestone, onClose, onStatusChange }: MilestoneStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<'completed' | 'skipped' | 'disregarded' | null>(null);
  const [reason, setReason] = useState('');
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  const handleStatusSelect = (status: 'completed' | 'skipped' | 'disregarded') => {
    if (status === 'completed') {
      onStatusChange(status);
      onClose();
    } else {
      setSelectedStatus(status);
    }
  };

  const handleContinueToImpact = () => {
    if (reason.trim()) {
      setShowImpactAnalysis(true);
    }
  };

  const handleConfirmStatus = () => {
    if (selectedStatus && reason.trim()) {
      onStatusChange(selectedStatus, reason);
      onClose();
    }
  };

  const getImpactSuggestions = () => {
    const status = selectedStatus;
    const suggestions = [];

    if (status === 'skipped') {
      suggestions.push({
        type: 'warning',
        icon: AlertTriangle,
        title: 'Timeline Impact',
        description: 'Skipping this milestone may delay your overall progress. Consider adjusting your target date or planning alternative steps.'
      });
      suggestions.push({
        type: 'info',
        icon: Info,
        title: 'Momentum Effect',
        description: 'Missing intermediate milestones can affect motivation. You might want to break down remaining milestones into smaller, achievable steps.'
      });
      suggestions.push({
        type: 'tip',
        icon: ArrowRight,
        title: 'Alternative Approach',
        description: 'Consider modifying this milestone instead of skipping it entirely. A simplified version might be more achievable right now.'
      });
    } else if (status === 'disregarded') {
      suggestions.push({
        type: 'caution',
        icon: AlertTriangle,
        title: 'Goal Alignment',
        description: 'Disregarding this milestone suggests it may not align with your current goals. Consider whether your resolution needs adjustment.'
      });
      suggestions.push({
        type: 'warning',
        icon: XCircle,
        title: 'Success Path',
        description: 'This milestone was designed as part of your success path. Removing it may make your resolution harder to achieve.'
      });
      suggestions.push({
        type: 'info',
        icon: Info,
        title: 'Progress Tracking',
        description: 'Disregarded milestones won\'t count toward your completion percentage. This may affect your overall progress statistics.'
      });
    }

    return suggestions;
  };

  if (showImpactAnalysis) {
    const suggestions = getImpactSuggestions();
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-gray-800">Impact Analysis</h2>
              <p className="text-sm text-gray-500">Review potential effects on your goal</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Milestone Info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <h3 className="text-sm text-gray-700 mb-1">Milestone</h3>
              <p className="text-gray-800">{milestone.title}</p>
              {milestone.description && (
                <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
              )}
            </div>

            {/* Status & Reason */}
            <div className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                {selectedStatus === 'skipped' ? (
                  <SkipForward className="w-5 h-5 text-orange-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm capitalize">
                  {selectedStatus === 'skipped' ? 'Skipping' : 'Disregarding'} this milestone
                </span>
              </div>
              <p className="text-sm text-gray-700 italic">"{reason}"</p>
            </div>

            {/* Impact Suggestions */}
            <div className="space-y-3 mb-6">
              <h3 className="text-gray-700 mb-3">Here's what you should know:</h3>
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                const colors = {
                  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
                  caution: 'bg-red-50 border-red-200 text-red-700',
                  info: 'bg-blue-50 border-blue-200 text-blue-700',
                  tip: 'bg-purple-50 border-purple-200 text-purple-700'
                };
                const iconColors = {
                  warning: 'text-yellow-600',
                  caution: 'text-red-600',
                  info: 'text-blue-600',
                  tip: 'text-purple-600'
                };
                
                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-4 border ${colors[suggestion.type as keyof typeof colors]}`}
                  >
                    <div className="flex gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[suggestion.type as keyof typeof iconColors]}`} />
                      <div>
                        <h4 className="text-sm mb-1">{suggestion.title}</h4>
                        <p className="text-xs opacity-90">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmStatus}
                className={`w-full px-6 py-3 rounded-xl text-white transition-all ${
                  selectedStatus === 'skipped'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-pink-500 hover:shadow-lg'
                }`}
              >
                I Understand - {selectedStatus === 'skipped' ? 'Skip' : 'Disregard'} Milestone
              </button>
              <button
                onClick={() => setShowImpactAnalysis(false)}
                className="w-full px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={onClose}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel - Keep Milestone Active
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-gray-800">Update Milestone Status</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Milestone Info */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="text-gray-800 mb-1">{milestone.title}</h3>
            {milestone.description && (
              <p className="text-sm text-gray-500">{milestone.description}</p>
            )}
          </div>

          {!selectedStatus ? (
            /* Status Selection */
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">How would you like to mark this milestone?</p>
              
              {/* Completed */}
              <button
                onClick={() => handleStatusSelect('completed')}
                className="w-full bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 rounded-2xl p-4 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 group-hover:bg-green-200 p-2 rounded-xl transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-green-800 mb-1">Completed</h3>
                    <p className="text-sm text-green-700">
                      You've successfully achieved this milestone
                    </p>
                  </div>
                </div>
              </button>

              {/* Skipped */}
              <button
                onClick={() => handleStatusSelect('skipped')}
                className="w-full bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border-2 border-orange-200 rounded-2xl p-4 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 group-hover:bg-orange-200 p-2 rounded-xl transition-colors">
                    <SkipForward className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-orange-800 mb-1">Skipped</h3>
                    <p className="text-sm text-orange-700">
                      You're moving forward without completing this milestone
                    </p>
                  </div>
                </div>
              </button>

              {/* Disregarded */}
              <button
                onClick={() => handleStatusSelect('disregarded')}
                className="w-full bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border-2 border-red-200 rounded-2xl p-4 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 group-hover:bg-red-200 p-2 rounded-xl transition-colors">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-800 mb-1">Disregard</h3>
                    <p className="text-sm text-red-700">
                      This milestone is no longer relevant to your goal
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            /* Reason Input */
            <div className="space-y-4">
              <div className={`rounded-2xl p-4 border-2 ${
                selectedStatus === 'skipped'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {selectedStatus === 'skipped' ? (
                    <SkipForward className="w-5 h-5 text-orange-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-sm capitalize text-gray-700">
                    {selectedStatus === 'skipped' ? 'Skipping' : 'Disregarding'} this milestone
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Why are you {selectedStatus === 'skipped' ? 'skipping' : 'disregarding'} this milestone? *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={`e.g., "${selectedStatus === 'skipped' 
                    ? 'I need more time to build foundational skills first' 
                    : 'This milestone no longer aligns with my updated goals'}"`}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  This helps you reflect on your decision and track your journey
                </p>
              </div>

              {/* Common Reasons */}
              <div>
                <p className="text-xs text-gray-600 mb-2">Common reasons:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedStatus === 'skipped' ? (
                    <>
                      <button
                        onClick={() => setReason('Not enough time right now')}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Not enough time
                      </button>
                      <button
                        onClick={() => setReason('Need to focus on other priorities')}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Other priorities
                      </button>
                      <button
                        onClick={() => setReason('Will revisit this later')}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Revisit later
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setReason('No longer relevant to my goal')}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Not relevant
                      </button>
                      <button
                        onClick={() => setReason('Goal has changed direction')}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Goal changed
                      </button>
                      <button
                        onClick={() => setReason('Found a better approach')}
                        className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Better approach
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedStatus(null)}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleContinueToImpact}
                  disabled={!reason.trim()}
                  className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                    reason.trim()
                      ? selectedStatus === 'skipped'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
