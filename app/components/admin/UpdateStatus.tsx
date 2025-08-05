import { useEffect, useState } from 'react';
import type { UpdateStatus as UpdateStatusType } from '~/lib/updates/UpdateManager.server';

interface UpdateStatusProps {
  status: UpdateStatusType;
}

export function UpdateStatus({ status }: UpdateStatusProps) {
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  if (currentStatus.status === 'idle') {
    return null;
  }

  const getStatusColor = () => {
    switch (currentStatus.status) {
      case 'checking':
        return 'bg-blue-50 border-blue-200';
      case 'downloading':
        return 'bg-yellow-50 border-yellow-200';
      case 'installing':
        return 'bg-orange-50 border-orange-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus.status) {
      case 'checking':
        return 'i-ph:magnifying-glass animate-pulse';
      case 'downloading':
        return 'i-ph:download animate-bounce';
      case 'installing':
        return 'i-ph:gear animate-spin';
      case 'completed':
        return 'i-ph:check-circle text-green-600';
      case 'failed':
        return 'i-ph:warning-circle text-red-600';
      default:
        return 'i-ph:info';
    }
  };

  const getStatusText = () => {
    switch (currentStatus.status) {
      case 'checking':
        return 'Checking for Updates';
      case 'downloading':
        return 'Downloading Update';
      case 'installing':
        return 'Installing Update';
      case 'completed':
        return 'Update Completed';
      case 'failed':
        return 'Update Failed';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="mt-6">
      <div className={`border rounded-xl p-6 ${getStatusColor()}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`text-2xl ${getStatusIcon()}`} />
          <div>
            <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">
              {getStatusText()}
            </h3>
            <p className="text-sm text-floraa-elements-textSecondary">
              {currentStatus.message}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {currentStatus.progress > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-floraa-elements-textSecondary mb-2">
              <span>Progress</span>
              <span>{currentStatus.progress}%</span>
            </div>
            <div className="w-full bg-floraa-elements-bg-depth-3 rounded-full h-2">
              <div
                className="bg-accent-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${currentStatus.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Timing Information */}
        <div className="flex items-center justify-between text-xs text-floraa-elements-textTertiary">
          {currentStatus.startedAt && (
            <span>
              Started: {new Date(currentStatus.startedAt).toLocaleTimeString()}
            </span>
          )}
          {currentStatus.completedAt && (
            <span>
              Completed: {new Date(currentStatus.completedAt).toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Error Message */}
        {currentStatus.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="i-ph:warning-circle text-red-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-red-800">Error Details</div>
                <div className="text-sm text-red-700 mt-1">{currentStatus.error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {currentStatus.status === 'failed' && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
            >
              Retry Update
            </button>
            <button
              type="button"
              className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
            >
              View Logs
            </button>
          </div>
        )}

        {currentStatus.status === 'completed' && (
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
            >
              View Changelog
            </button>
            <button
              type="button"
              className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
            >
              Restart Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}