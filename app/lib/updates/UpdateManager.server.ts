import { z } from 'zod';

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  html_url: string;
  assets: Array<{
    id: number;
    name: string;
    download_url: string;
    size: number;
  }>;
}

export interface UpdateInfo {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  release: GitHubRelease | null;
  changelog: string;
  updateSize: number;
  releaseDate: string;
  isPrerelease: boolean;
}

export interface UpdateStatus {
  status: 'idle' | 'checking' | 'downloading' | 'installing' | 'completed' | 'failed';
  progress: number;
  message: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

class UpdateManager {
  private static instance: UpdateManager;
  private readonly GITHUB_REPO = 'floraa-dev/floraa-saas'; // Update with actual repo
  private readonly CURRENT_VERSION = process.env.APP_VERSION || '1.0.0';
  private updateStatus: UpdateStatus = {
    status: 'idle',
    progress: 0,
    message: 'Ready to check for updates',
  };
  private listeners: Set<(status: UpdateStatus) => void> = new Set();

  private constructor() {}

  public static getInstance(): UpdateManager {
    if (!UpdateManager.instance) {
      UpdateManager.instance = new UpdateManager();
    }
    return UpdateManager.instance;
  }

  public async checkForUpdates(): Promise<UpdateInfo> {
    this.updateStatus = {
      status: 'checking',
      progress: 10,
      message: 'Checking for updates...',
    };
    this.notifyListeners();

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.GITHUB_REPO}/releases/latest`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Floraa-Update-Manager',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const release: GitHubRelease = await response.json();
      const hasUpdate = this.compareVersions(release.tag_name, this.CURRENT_VERSION) > 0;

      this.updateStatus = {
        status: 'idle',
        progress: 100,
        message: hasUpdate ? 'Update available' : 'Up to date',
      };
      this.notifyListeners();

      return {
        currentVersion: this.CURRENT_VERSION,
        latestVersion: release.tag_name,
        hasUpdate,
        release,
        changelog: release.body,
        updateSize: release.assets.reduce((total, asset) => total + asset.size, 0),
        releaseDate: release.published_at,
        isPrerelease: release.prerelease,
      };
    } catch (error) {
      this.updateStatus = {
        status: 'failed',
        progress: 0,
        message: 'Failed to check for updates',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.notifyListeners();
      throw error;
    }
  }

  public async performUpdate(version: string): Promise<void> {
    this.updateStatus = {
      status: 'downloading',
      progress: 0,
      message: 'Preparing update...',
      startedAt: new Date().toISOString(),
    };
    this.notifyListeners();

    try {
      // Step 1: Enable maintenance mode
      await this.enableMaintenanceMode();
      
      this.updateStatus = {
        ...this.updateStatus,
        progress: 20,
        message: 'Maintenance mode enabled',
      };
      this.notifyListeners();

      // Step 2: Download update
      await this.downloadUpdate(version);
      
      this.updateStatus = {
        ...this.updateStatus,
        progress: 60,
        message: 'Installing update...',
        status: 'installing',
      };
      this.notifyListeners();

      // Step 3: Install update
      await this.installUpdate(version);
      
      this.updateStatus = {
        ...this.updateStatus,
        progress: 90,
        message: 'Finalizing update...',
      };
      this.notifyListeners();

      // Step 4: Restart services
      await this.restartServices();
      
      this.updateStatus = {
        status: 'completed',
        progress: 100,
        message: 'Update completed successfully',
        completedAt: new Date().toISOString(),
      };
      this.notifyListeners();

      // Step 5: Disable maintenance mode
      await this.disableMaintenanceMode();

    } catch (error) {
      this.updateStatus = {
        status: 'failed',
        progress: 0,
        message: 'Update failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.notifyListeners();
      
      // Try to disable maintenance mode even if update failed
      try {
        await this.disableMaintenanceMode();
      } catch (maintenanceError) {
        console.error('Failed to disable maintenance mode:', maintenanceError);
      }
      
      throw error;
    }
  }

  public async rollbackUpdate(targetVersion: string): Promise<void> {
    this.updateStatus = {
      status: 'installing',
      progress: 0,
      message: 'Rolling back update...',
      startedAt: new Date().toISOString(),
    };
    this.notifyListeners();

    try {
      await this.enableMaintenanceMode();
      
      this.updateStatus = {
        ...this.updateStatus,
        progress: 30,
        message: 'Restoring previous version...',
      };
      this.notifyListeners();

      await this.restorePreviousVersion(targetVersion);
      
      this.updateStatus = {
        ...this.updateStatus,
        progress: 70,
        message: 'Restarting services...',
      };
      this.notifyListeners();

      await this.restartServices();
      
      this.updateStatus = {
        status: 'completed',
        progress: 100,
        message: 'Rollback completed successfully',
        completedAt: new Date().toISOString(),
      };
      this.notifyListeners();

      await this.disableMaintenanceMode();

    } catch (error) {
      this.updateStatus = {
        status: 'failed',
        progress: 0,
        message: 'Rollback failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.notifyListeners();
      throw error;
    }
  }

  public getUpdateStatus(): UpdateStatus {
    return this.updateStatus;
  }

  public subscribe(listener: (status: UpdateStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.updateStatus));
  }

  private compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.replace(/^v/, '').split('.').map(Number);
    const v2Parts = version2.replace(/^v/, '').split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0;
      const v2Part = v2Parts[i] || 0;
      
      if (v1Part > v2Part) return 1;
      if (v1Part < v2Part) return -1;
    }
    
    return 0;
  }

  private async enableMaintenanceMode(): Promise<void> {
    // Import configManager dynamically to avoid circular dependencies
    const { configManager } = await import('~/lib/config/ConfigManager.server');
    await configManager.updateConfig({
      app: {
        ...configManager.getConfig().app,
        maintenanceMode: true,
        maintenanceMessage: 'System is being updated. Please check back in a few minutes.',
      },
    });
  }

  private async disableMaintenanceMode(): Promise<void> {
    const { configManager } = await import('~/lib/config/ConfigManager.server');
    await configManager.updateConfig({
      app: {
        ...configManager.getConfig().app,
        maintenanceMode: false,
      },
    });
  }

  private async downloadUpdate(version: string): Promise<void> {
    // Simulate download progress
    for (let i = 20; i <= 50; i += 5) {
      this.updateStatus = {
        ...this.updateStatus,
        progress: i,
        message: `Downloading update ${version}... ${i}%`,
      };
      this.notifyListeners();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  private async installUpdate(version: string): Promise<void> {
    // In a real implementation, this would:
    // 1. Extract the downloaded files
    // 2. Backup current version
    // 3. Replace application files
    // 4. Run database migrations if needed
    // 5. Update configuration files
    
    // Simulate installation progress
    for (let i = 60; i <= 85; i += 5) {
      this.updateStatus = {
        ...this.updateStatus,
        progress: i,
        message: `Installing update ${version}... ${i}%`,
      };
      this.notifyListeners();
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  private async restartServices(): Promise<void> {
    // In a real implementation, this would restart the application services
    // For now, we'll simulate the restart process
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  private async restorePreviousVersion(version: string): Promise<void> {
    // In a real implementation, this would restore from backup
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  public async getUpdateHistory(): Promise<Array<{
    version: string;
    date: string;
    status: 'success' | 'failed' | 'rolled_back';
    changelog: string;
  }>> {
    // In a real implementation, this would fetch from database
    return [
      {
        version: '1.2.0',
        date: '2024-01-20T10:30:00Z',
        status: 'success',
        changelog: 'Added new AI models and improved performance',
      },
      {
        version: '1.1.5',
        date: '2024-01-15T14:22:00Z',
        status: 'success',
        changelog: 'Bug fixes and security improvements',
      },
      {
        version: '1.1.4',
        date: '2024-01-10T09:15:00Z',
        status: 'rolled_back',
        changelog: 'Performance improvements (rolled back due to issues)',
      },
    ];
  }

  public async scheduleUpdate(version: string, scheduledTime: Date): Promise<void> {
    // In a real implementation, this would schedule the update
    console.log(`Update ${version} scheduled for ${scheduledTime.toISOString()}`);
  }

  public async cancelScheduledUpdate(): Promise<void> {
    // In a real implementation, this would cancel any scheduled updates
    console.log('Scheduled update cancelled');
  }
}

export const updateManager = UpdateManager.getInstance();