import React, { useCallback, useEffect, useState } from 'react';
import { useSettings } from '~/lib/hooks/useSettings';
import commit from '~/commit.json';

const versionHash = commit.commit; // Get the version hash from commit.json

export default function DebugTab() {
  const { providers } = useSettings();
  const [activeProviders, setActiveProviders] = useState<string[]>([]);
  useEffect(() => {
    setActiveProviders(
      Object.entries(providers)
        .filter(([_key, provider]) => provider.settings.enabled)
        .map(([_key, provider]) => provider.name),
    );
  }, [providers]);

  const handleCopyToClipboard = useCallback(() => {
    const debugInfo = {
      OS: navigator.platform,
      Browser: navigator.userAgent,
      ActiveFeatures: activeProviders,
      BaseURLs: {
        Ollama: process.env.REACT_APP_OLLAMA_URL,
        OpenAI: process.env.REACT_APP_OPENAI_URL,
        LMStudio: process.env.REACT_APP_LM_STUDIO_URL,
      },
      Version: versionHash,
    };
    navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2)).then(() => {
      alert('Debug information copied to clipboard!');
    });
  }, [providers]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-medium text-floraa-elements-textPrimary mb-4">Debug Tab</h3>
      <button
        onClick={handleCopyToClipboard}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 mb-4 transition-colors duration-200"
      >
        Copy to Clipboard
      </button>

      <h4 className="text-md font-medium text-floraa-elements-textPrimary">System Information</h4>
      <p className="text-floraa-elements-textSecondary">OS: {navigator.platform}</p>
      <p className="text-floraa-elements-textSecondary">Browser: {navigator.userAgent}</p>

      <h4 className="text-md font-medium text-floraa-elements-textPrimary mt-4">Active Features</h4>
      <ul>
        {activeProviders.map((name) => (
          <li key={name} className="text-floraa-elements-textSecondary">
            {name}
          </li>
        ))}
      </ul>

      <h4 className="text-md font-medium text-floraa-elements-textPrimary mt-4">Base URLs</h4>
      <ul>
        <li className="text-floraa-elements-textSecondary">Ollama: {process.env.REACT_APP_OLLAMA_URL}</li>
        <li className="text-floraa-elements-textSecondary">OpenAI: {process.env.REACT_APP_OPENAI_URL}</li>
        <li className="text-floraa-elements-textSecondary">LM Studio: {process.env.REACT_APP_LM_STUDIO_URL}</li>
      </ul>

      <h4 className="text-md font-medium text-floraa-elements-textPrimary mt-4">Version Information</h4>
      <p className="text-floraa-elements-textSecondary">Version Hash: {versionHash}</p>
    </div>
  );
}
