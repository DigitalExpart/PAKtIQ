import { Info, Sparkles } from 'lucide-react';

export function MilestoneInfoBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 mb-4 text-white">
      <div className="flex items-start gap-3">
        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4" />
            <span className="text-sm">Smart Suggestions Available!</span>
          </div>
          <p className="text-xs opacity-90">
            We've created a personalized milestone timeline based on your resolution category. Select multiple milestones at once or click the + button to add them individually.
          </p>
        </div>
      </div>
    </div>
  );
}
