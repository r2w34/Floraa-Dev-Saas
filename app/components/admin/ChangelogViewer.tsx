import { useState } from 'react';

interface ChangelogViewerProps {
  changelog: string;
  version: string;
}

export function ChangelogViewer({ changelog, version }: ChangelogViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const parseChangelog = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const sections: { [key: string]: string[] } = {
      added: [],
      changed: [],
      fixed: [],
      removed: [],
      security: [],
      other: [],
    };

    let currentSection = 'other';

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check for section headers
      if (trimmed.toLowerCase().includes('added') || trimmed.toLowerCase().includes('new')) {
        currentSection = 'added';
      } else if (trimmed.toLowerCase().includes('changed') || trimmed.toLowerCase().includes('updated')) {
        currentSection = 'changed';
      } else if (trimmed.toLowerCase().includes('fixed') || trimmed.toLowerCase().includes('bug')) {
        currentSection = 'fixed';
      } else if (trimmed.toLowerCase().includes('removed') || trimmed.toLowerCase().includes('deprecated')) {
        currentSection = 'removed';
      } else if (trimmed.toLowerCase().includes('security')) {
        currentSection = 'security';
      } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
        // This is a list item
        sections[currentSection].push(trimmed.substring(1).trim());
      } else if (trimmed && !trimmed.startsWith('#')) {
        // Regular text
        sections[currentSection].push(trimmed);
      }
    });

    return sections;
  };

  const sections = parseChangelog(changelog);
  const hasContent = Object.values(sections).some(items => items.length > 0);

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'added':
        return 'i-ph:plus-circle text-green-600';
      case 'changed':
        return 'i-ph:arrow-clockwise text-blue-600';
      case 'fixed':
        return 'i-ph:wrench text-orange-600';
      case 'removed':
        return 'i-ph:minus-circle text-red-600';
      case 'security':
        return 'i-ph:shield-check text-purple-600';
      default:
        return 'i-ph:info text-gray-600';
    }
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'added':
        return 'Added';
      case 'changed':
        return 'Changed';
      case 'fixed':
        return 'Fixed';
      case 'removed':
        return 'Removed';
      case 'security':
        return 'Security';
      default:
        return 'Other';
    }
  };

  if (!hasContent) {
    return (
      <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
        <h2 className="text-xl font-semibold text-floraa-elements-textPrimary mb-4">
          Release Notes
        </h2>
        <div className="text-center py-8">
          <div className="i-ph:file-text text-4xl text-floraa-elements-textSecondary mb-4" />
          <p className="text-floraa-elements-textSecondary">
            No changelog available for this version
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-floraa-elements-textPrimary">
          Release Notes
        </h2>
        <div className="text-sm text-floraa-elements-textSecondary">
          Version {version}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(sections).map(([section, items]) => {
          if (items.length === 0) return null;

          const displayItems = isExpanded ? items : items.slice(0, 3);
          const hasMore = items.length > 3 && !isExpanded;

          return (
            <div key={section} className="border border-floraa-elements-borderColor rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={getSectionIcon(section)} />
                <h3 className="font-medium text-floraa-elements-textPrimary">
                  {getSectionTitle(section)}
                </h3>
                <span className="text-xs text-floraa-elements-textTertiary bg-floraa-elements-bg-depth-3 px-2 py-1 rounded-full">
                  {items.length}
                </span>
              </div>
              
              <ul className="space-y-2">
                {displayItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-floraa-elements-textSecondary">
                    <div className="i-ph:dot-outline text-floraa-elements-textTertiary mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {hasMore && (
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="mt-2 text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
                >
                  Show {items.length - 3} more items
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-floraa-elements-borderColor">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Show All Changes'}
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
            >
              Copy Changelog
            </button>
            <button
              type="button"
              className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary text-sm font-medium transition-colors"
            >
              View on GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}