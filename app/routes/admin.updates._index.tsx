import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { json } from '@remix-run/cloudflare';
import { useLoaderData, useActionData, useFetcher } from '@remix-run/react';
import { AdminLayout } from '~/components/admin/AdminLayout';
import { UpdateStatus } from '~/components/admin/UpdateStatus';
import { UpdateHistory } from '~/components/admin/UpdateHistory';
import { ChangelogViewer } from '~/components/admin/ChangelogViewer';
import { updateManager } from '~/lib/updates/UpdateManager.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'System Updates - Floraa.dev Admin' },
    { name: 'description', content: 'Manage system updates and view update history.' }
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [updateInfo, updateStatus, updateHistory] = await Promise.all([
      updateManager.checkForUpdates(),
      updateManager.getUpdateStatus(),
      updateManager.getUpdateHistory(),
    ]);

    return json({
      updateInfo,
      updateStatus,
      updateHistory,
      autoUpdatesEnabled: true, // Get from config
    });
  } catch (error) {
    console.error('Failed to load update information:', error);
    return json({
      updateInfo: null,
      updateStatus: updateManager.getUpdateStatus(),
      updateHistory: [],
      autoUpdatesEnabled: true,
      error: error instanceof Error ? error.message : 'Failed to load update information',
    });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get('_action') as string;

  try {
    switch (action) {
      case 'check_updates': {
        const updateInfo = await updateManager.checkForUpdates();
        return json({ 
          success: true, 
          updateInfo,
          message: updateInfo.hasUpdate ? 'Update available!' : 'System is up to date' 
        });
      }
      
      case 'install_update': {
        const version = formData.get('version') as string;
        
        // Start the update process (this will run in background)
        updateManager.performUpdate(version).catch(error => {
          console.error('Update failed:', error);
        });
        
        return json({ 
          success: true, 
          message: 'Update started. You can monitor progress below.' 
        });
      }
      
      case 'schedule_update': {
        const version = formData.get('version') as string;
        const scheduledTime = new Date(formData.get('scheduledTime') as string);
        
        await updateManager.scheduleUpdate(version, scheduledTime);
        
        return json({ 
          success: true, 
          message: `Update ${version} scheduled for ${scheduledTime.toLocaleString()}` 
        });
      }
      
      case 'cancel_update': {
        await updateManager.cancelScheduledUpdate();
        
        return json({ 
          success: true, 
          message: 'Scheduled update cancelled' 
        });
      }
      
      case 'rollback_update': {
        const targetVersion = formData.get('targetVersion') as string;
        
        // Start the rollback process
        updateManager.rollbackUpdate(targetVersion).catch(error => {
          console.error('Rollback failed:', error);
        });
        
        return json({ 
          success: true, 
          message: 'Rollback started. You can monitor progress below.' 
        });
      }
      
      default:
        return json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Update action error:', error);
    return json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Update action failed' 
    }, { status: 500 });
  }
}

export default function AdminUpdates() {
  const { updateInfo, updateStatus, updateHistory, autoUpdatesEnabled, error } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const fetcher = useFetcher();

  const isUpdating = updateStatus.status === 'downloading' || updateStatus.status === 'installing';
  const canUpdate = updateInfo?.hasUpdate && updateStatus.status === 'idle';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-floraa-elements-textPrimary">System Updates</h1>
            <p className="text-floraa-elements-textSecondary">
              Manage system updates and monitor update history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <fetcher.Form method="post">
              <input type="hidden" name="_action" value="check_updates" />
              <button
                type="submit"
                disabled={fetcher.state === 'submitting' || isUpdating}
                className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetcher.state === 'submitting' ? 'Checking...' : 'Check for Updates'}
              </button>
            </fetcher.Form>
          </div>
        </div>

        {(actionData?.message || error) && (
          <div className={`p-4 rounded-lg border ${
            actionData?.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              <div className={`${
                actionData?.success ? 'i-ph:check-circle' : 'i-ph:warning-circle'
              } text-lg`} />
              <span className="font-medium">{actionData?.message || error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Version & Update Status */}
          <div className="lg:col-span-2">
            <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-floraa-elements-textPrimary">
                  Current Version
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    updateInfo?.hasUpdate ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-sm text-floraa-elements-textSecondary">
                    {updateInfo?.hasUpdate ? 'Update Available' : 'Up to Date'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-floraa-elements-textSecondary mb-1">
                    Current Version
                  </div>
                  <div className="text-2xl font-bold text-floraa-elements-textPrimary">
                    {updateInfo?.currentVersion || '1.0.0'}
                  </div>
                </div>
                
                {updateInfo?.hasUpdate && (
                  <div>
                    <div className="text-sm text-floraa-elements-textSecondary mb-1">
                      Latest Version
                    </div>
                    <div className="text-2xl font-bold text-accent-600">
                      {updateInfo.latestVersion}
                    </div>
                  </div>
                )}
              </div>

              {updateInfo?.hasUpdate && (
                <div className="space-y-4">
                  <div className="p-4 bg-accent-50 border border-accent-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="i-ph:download text-accent-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-accent-800 mb-1">
                          Update Available: {updateInfo.latestVersion}
                        </h3>
                        <p className="text-sm text-accent-700 mb-3">
                          Released on {new Date(updateInfo.releaseDate).toLocaleDateString()}
                          {updateInfo.isPrerelease && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Pre-release
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-accent-700">
                          <span>Size: {(updateInfo.updateSize / 1024 / 1024).toFixed(1)} MB</span>
                          <a
                            href={updateInfo.release?.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            View on GitHub →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <fetcher.Form method="post">
                      <input type="hidden" name="_action" value="install_update" />
                      <input type="hidden" name="version" value={updateInfo.latestVersion} />
                      <button
                        type="submit"
                        disabled={!canUpdate || fetcher.state === 'submitting'}
                        className="bg-accent-600 hover:bg-accent-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {fetcher.state === 'submitting' ? 'Starting Update...' : 'Install Update'}
                      </button>
                    </fetcher.Form>
                    
                    <button
                      type="button"
                      className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Schedule Update
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Update Progress */}
            <UpdateStatus status={updateStatus} />
          </div>

          {/* Changelog */}
          <div>
            {updateInfo?.changelog && (
              <ChangelogViewer 
                changelog={updateInfo.changelog}
                version={updateInfo.latestVersion}
              />
            )}
          </div>
        </div>

        {/* Update History */}
        <UpdateHistory history={updateHistory} />

        {/* Auto-Update Settings */}
        <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
          <h2 className="text-xl font-semibold text-floraa-elements-textPrimary mb-4">
            Auto-Update Settings
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-floraa-elements-textPrimary">
                  Enable Automatic Updates
                </div>
                <div className="text-sm text-floraa-elements-textSecondary">
                  Automatically install updates when available
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoUpdatesEnabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-floraa-elements-textPrimary">
                  Include Pre-releases
                </div>
                <div className="text-sm text-floraa-elements-textSecondary">
                  Install beta and pre-release versions
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-floraa-elements-bg-depth-3 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}