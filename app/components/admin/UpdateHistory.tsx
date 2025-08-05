import { useState } from 'react';
import { Form } from '@remix-run/react';

interface UpdateHistoryItem {
  version: string;
  date: string;
  status: 'success' | 'failed' | 'rolled_back';
  changelog: string;
}

interface UpdateHistoryProps {
  history: UpdateHistoryItem[];
}

export function UpdateHistory({ history }: UpdateHistoryProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (version: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'rolled_back':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return 'i-ph:check-circle';
      case 'failed':
        return 'i-ph:x-circle';
      case 'rolled_back':
        return 'i-ph:arrow-counter-clockwise';
      default:
        return 'i-ph:info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Successful';
      case 'failed':
        return 'Failed';
      case 'rolled_back':
        return 'Rolled Back';
      default:
        return 'Unknown';
    }
  };

  if (history.length === 0) {
    return (
      <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
        <h2 className="text-xl font-semibold text-floraa-elements-textPrimary mb-4">
          Update History
        </h2>
        <div className="text-center py-8">
          <div className="i-ph:clock-clockwise text-4xl text-floraa-elements-textSecondary mb-4" />
          <p className="text-floraa-elements-textSecondary">
            No update history available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-floraa-elements-textPrimary">
          Update History
        </h2>
        <button
          type="button"
          className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
        >
          Export History
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.version}
            className="border border-floraa-elements-borderColor rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${getStatusColor(item.status)}`}>
                    <div className={`${getStatusIcon(item.status)} text-lg`} />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-floraa-elements-textPrimary">
                        Version {item.version}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    <p className="text-sm text-floraa-elements-textSecondary">
                      {new Date(item.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'success' && (
                    <Form method="post">
                      <input type="hidden" name="_action" value="rollback_update" />
                      <input type="hidden" name="targetVersion" value={item.version} />
                      <button
                        type="submit"
                        className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
                      >
                        Rollback
                      </button>
                    </Form>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => toggleExpanded(item.version)}
                    className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary p-1 rounded transition-colors"
                  >
                    <div className={`i-ph:caret-down transition-transform ${
                      expandedItems.has(item.version) ? 'rotate-180' : ''
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {expandedItems.has(item.version) && (
              <div className="border-t border-floraa-elements-borderColor bg-floraa-elements-bg-depth-1 p-4">
                <h4 className="text-sm font-medium text-floraa-elements-textPrimary mb-2">
                  Changelog
                </h4>
                <div className="prose prose-sm max-w-none text-floraa-elements-textSecondary">
                  {item.changelog.split('\n').map((line, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {line}
                    </p>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-floraa-elements-borderColor">
                  <button
                    type="button"
                    className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
                  >
                    View Full Release Notes
                  </button>
                  <button
                    type="button"
                    className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
                  >
                    Download Release
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {history.length > 5 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
          >
            Load More History
          </button>
        </div>
      )}
    </div>
  );
}