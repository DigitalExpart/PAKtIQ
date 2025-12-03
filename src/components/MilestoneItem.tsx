import { useState } from 'react';
import { Milestone } from '../App';
import { Check, Trash2, Bell, BellOff, Calendar } from 'lucide-react';

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Milestone>) => void;
}

export function MilestoneItem({ milestone, index, onToggle, onDelete, onUpdate }: MilestoneItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const handleSetReminder = (datetime: string) => {
    onUpdate({ reminderDate: datetime });
    setShowReminderPicker(false);
  };

  const handleRemoveReminder = () => {
    onUpdate({ reminderDate: undefined });
  };

  const formatReminderDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (diffInHours < 48) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
  };

  const getTimeUntilReminder = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months`;
    return `${Math.ceil(diffDays / 365)} years`;
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${
      milestone.completed ? 'opacity-60' : ''
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
            milestone.completed
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-600'
              : 'border-gray-300 hover:border-purple-500'
          }`}
        >
          {milestone.completed && <Check className="w-4 h-4 text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`text-gray-800 ${milestone.completed ? 'line-through' : ''}`}>
              {milestone.title}
            </h3>
            <span className="text-xs text-gray-400 flex-shrink-0">#{index + 1}</span>
          </div>
          
          {milestone.description && (
            <p className={`text-sm text-gray-500 mb-2 ${milestone.completed ? 'line-through' : ''}`}>
              {milestone.description}
            </p>
          )}

          {/* Reminder Info */}
          {milestone.reminderDate && !milestone.completed && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                <Bell className="w-3 h-3" />
                <span>{formatReminderDate(milestone.reminderDate)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Calendar className="w-3 h-3" />
                <span>{getTimeUntilReminder(milestone.reminderDate)}</span>
              </div>
            </div>
          )}

          {milestone.completed && milestone.completedAt && (
            <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit mb-2">
              <Check className="w-3 h-3" />
              <span>Completed {new Date(milestone.completedAt).toLocaleDateString()}</span>
            </div>
          )}

          {/* Actions */}
          {!milestone.completed && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => setShowReminderPicker(!showReminderPicker)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {milestone.reminderDate ? (
                  <>
                    <BellOff className="w-3 h-3" />
                    Edit Reminder
                  </>
                ) : (
                  <>
                    <Bell className="w-3 h-3" />
                    Set Reminder
                  </>
                )}
              </button>
              
              <button
                onClick={handleDelete}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition-colors ${
                  showDeleteConfirm
                    ? 'bg-red-500 text-white'
                    : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Trash2 className="w-3 h-3" />
                {showDeleteConfirm ? 'Confirm' : 'Delete'}
              </button>
            </div>
          )}

          {/* Reminder Picker */}
          {showReminderPicker && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2">
              <label className="block text-xs text-gray-700">
                <Calendar className="w-3 h-3 inline mr-1" />
                Set reminder date & time:
              </label>
              <input
                type="datetime-local"
                defaultValue={milestone.reminderDate?.slice(0, 16)}
                onChange={(e) => {
                  if (e.target.value) {
                    handleSetReminder(new Date(e.target.value).toISOString());
                  }
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowReminderPicker(false)}
                  className="flex-1 px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                {milestone.reminderDate && (
                  <button
                    onClick={handleRemoveReminder}
                    className="flex-1 px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Remove Reminder
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
