import { useState, useEffect } from 'react';
import { useFetcher } from '@remix-run/react';

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  ssh_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  default_branch: string;
}

interface GitHubRepoSelectorProps {
  onRepoSelect: (repo: Repository) => void;
  selectedRepo?: Repository;
}

export function GitHubRepoSelector({ onRepoSelect, selectedRepo }: GitHubRepoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fetcher = useFetcher<{ repositories: Repository[] }>();

  useEffect(() => {
    if (isOpen && !fetcher.data) {
      fetcher.load('/api/github/repositories');
    }
  }, [isOpen, fetcher]);

  const repositories = fetcher.data?.repositories || [];
  const filteredRepos = repositories.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-500',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-orange-500',
      'C++': 'bg-pink-500',
      C: 'bg-gray-500',
      'C#': 'bg-purple-500',
      PHP: 'bg-indigo-500',
      Ruby: 'bg-red-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-600',
      Swift: 'bg-orange-400',
      Kotlin: 'bg-purple-600',
      Dart: 'bg-blue-400',
      HTML: 'bg-orange-500',
      CSS: 'bg-blue-600',
      Vue: 'bg-green-400',
      React: 'bg-blue-400',
    };
    return colors[language] || 'bg-gray-400';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary hover:bg-floraa-elements-bg-depth-3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="i-ph:github-logo text-lg" />
          <div className="text-left">
            {selectedRepo ? (
              <>
                <div className="font-medium">{selectedRepo.name}</div>
                <div className="text-sm text-floraa-elements-textSecondary">
                  {selectedRepo.description || 'No description'}
                </div>
              </>
            ) : (
              <div className="text-floraa-elements-textSecondary">
                Select a GitHub repository
              </div>
            )}
          </div>
        </div>
        <div className={`i-ph:caret-down transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          <div className="p-3 border-b border-floraa-elements-borderColor">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="i-ph:magnifying-glass text-floraa-elements-textSecondary" />
              </div>
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {fetcher.state === 'loading' ? (
              <div className="p-4 text-center">
                <div className="i-ph:spinner animate-spin text-2xl text-floraa-elements-textSecondary" />
                <p className="mt-2 text-sm text-floraa-elements-textSecondary">
                  Loading repositories...
                </p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-4 text-center">
                <div className="i-ph:folder-open text-2xl text-floraa-elements-textSecondary" />
                <p className="mt-2 text-sm text-floraa-elements-textSecondary">
                  {searchTerm ? 'No repositories found' : 'No repositories available'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-floraa-elements-borderColor">
                {filteredRepos.map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => {
                      onRepoSelect(repo);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="w-full p-4 text-left hover:bg-floraa-elements-bg-depth-3 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-floraa-elements-textPrimary truncate">
                            {repo.name}
                          </div>
                          {repo.private && (
                            <div className="i-ph:lock text-sm text-floraa-elements-textSecondary" />
                          )}
                        </div>
                        
                        {repo.description && (
                          <p className="text-sm text-floraa-elements-textSecondary mb-2 line-clamp-2">
                            {repo.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-floraa-elements-textSecondary">
                          {repo.language && (
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${getLanguageColor(repo.language)}`} />
                              {repo.language}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1">
                            <div className="i-ph:star" />
                            {repo.stargazers_count}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <div className="i-ph:git-fork" />
                            {repo.forks_count}
                          </div>
                          
                          <div>
                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-floraa-elements-borderColor bg-floraa-elements-bg-depth-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}