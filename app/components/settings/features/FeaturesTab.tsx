import React from 'react';
import { Switch } from '~/components/ui/Switch';
import { useSettings } from '~/lib/hooks/useSettings';

export default function FeaturesTab() {
  const { debug, enableDebugMode, isLocalModel, enableLocalModels } = useSettings();
  return (
    <div className="p-4 bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-lg mb-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-floraa-elements-textPrimary mb-4">Optional Features</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-floraa-elements-textPrimary">Debug Info</span>
          <Switch className="ml-auto" checked={debug} onCheckedChange={enableDebugMode} />
        </div>
      </div>

      <div className="mb-6 border-t border-floraa-elements-borderColor pt-4">
        <h3 className="text-lg font-medium text-floraa-elements-textPrimary mb-4">Experimental Features</h3>
        <p className="text-sm text-floraa-elements-textSecondary mb-4">
          Disclaimer: Experimental features may be unstable and are subject to change.
        </p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-floraa-elements-textPrimary">Enable Local Models</span>
          <Switch className="ml-auto" checked={isLocalModel} onCheckedChange={enableLocalModels} />
        </div>
      </div>
    </div>
  );
}
