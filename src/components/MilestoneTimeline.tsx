import { Calendar, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Milestone } from '../App';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  targetDate: string;
}

export function MilestoneTimeline({ milestones, targetDate }: MilestoneTimelineProps) {
  // Sort milestones by reminder date
  const sortedMilestones = [...milestones]
    .filter(m => m.reminderDate)
    .sort((a, b) => {
      const dateA = a.reminderDate ? new Date(a.reminderDate).getTime() : 0;
      const dateB = b.reminderDate ? new Date(b.reminderDate).getTime() : 0;
      return dateA - dateB;
    });

  if (sortedMilestones.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getTimeStatus = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 7) return 'upcoming';
    return 'future';
  };

  return (
    <div className="bg-white rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-purple-600" />
        <h3 className="text-gray-800">Milestone Timeline</h3>
      </div>

      <div className="space-y-3">
        {sortedMilestones.map((milestone, index) => {
          const status = getTimeStatus(milestone.reminderDate!);
          const isCompleted = milestone.completed;
          
          return (
            <div key={milestone.id} className="flex items-start gap-3">
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center">
                <div className={`rounded-full p-1 ${
                  isCompleted
                    ? 'bg-green-100'
                    : status === 'overdue'
                    ? 'bg-red-100'
                    : status === 'upcoming'
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className={`w-4 h-4 ${
                      status === 'overdue'
                        ? 'text-red-600'
                        : status === 'upcoming'
                        ? 'text-purple-600'
                        : 'text-gray-400'
                    }`} />
                  )}
                </div>
                {index < sortedMilestones.length - 1 && (
                  <div className={`w-0.5 h-8 ${
                    isCompleted ? 'bg-green-200' : 'bg-gray-200'
                  }`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className={`text-sm text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {milestone.description}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-green-50 text-green-700'
                        : status === 'overdue'
                        ? 'bg-red-50 text-red-700'
                        : status === 'upcoming'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(milestone.reminderDate!)}</span>
                    </div>
                    {isCompleted && (
                      <span className="text-xs text-green-600">✓ Done</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Target date */}
        <div className="flex items-start gap-3 opacity-60">
          <div className="flex flex-col items-center">
            <div className="rounded-full p-1 bg-blue-100">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 pb-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm text-gray-700">Resolution Target</h4>
              <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(targetDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
