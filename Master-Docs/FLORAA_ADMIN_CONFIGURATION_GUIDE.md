# Floraa.dev Admin Configuration & Auto-Update System

## 🎯 Overview

Floraa.dev features a comprehensive admin configuration system that allows you to manage all aspects of your SaaS platform from a centralized web interface. Additionally, the auto-update system keeps your platform current with the latest features and security patches directly from the GitHub repository.

## 🔧 Configuration Management System

### **Centralized Configuration**
All system settings are managed through a unified configuration system that:
- **Database-Backed**: Configurations stored in database, not just environment variables
- **Real-Time Updates**: Changes take effect immediately without restarts
- **Validation**: All configurations validated using Zod schemas
- **Rollback Support**: Ability to revert configuration changes
- **Import/Export**: Backup and restore configurations

### **Configuration Sections**

#### **1. Application Settings**
```typescript
app: {
  name: string;                    // Application name
  url: string;                     // Base URL
  description: string;             // App description
  logo?: string;                   // Logo URL
  favicon?: string;                // Favicon URL
  maintenanceMode: boolean;        // Maintenance mode toggle
  maintenanceMessage: string;      // Maintenance message
}
```

**Admin Interface Features:**
- ✅ Application branding configuration
- ✅ Maintenance mode toggle with custom message
- ✅ URL and metadata management
- ✅ Real-time preview of changes

#### **2. Authentication Settings**
```typescript
auth: {
  github: {
    clientId?: string;             // GitHub OAuth Client ID
    clientSecret?: string;         // GitHub OAuth Secret
    callbackUrl?: string;          // OAuth callback URL
    enabled: boolean;              // Enable/disable GitHub auth
  };
  session: {
    secret: string;                // Session encryption secret
    maxAge: number;                // Session duration
    secure: boolean;               // HTTPS-only sessions
  };
  registration: {
    enabled: boolean;              // Allow new registrations
    requireEmailVerification: boolean;
    defaultPlan: 'free' | 'pro' | 'enterprise';
  };
}
```

**Admin Interface Features:**
- ✅ GitHub OAuth configuration with connection testing
- ✅ Session security settings
- ✅ Registration controls and default plan assignment
- ✅ Real-time authentication testing

#### **3. AI Model Configuration**
```typescript
ai: {
  providers: {
    openai: {
      apiKey?: string;             // OpenAI API key
      enabled: boolean;            // Enable provider
      models: string[];            // Available models
    };
    anthropic: { /* similar */ };
    google: { /* similar */ };
  };
  defaultModel: string;            // Default AI model
  rateLimiting: {
    enabled: boolean;              // Enable rate limiting
    requestsPerMinute: number;     // Rate limit settings
    requestsPerHour: number;
  };
}
```

**Admin Interface Features:**
- ✅ Multi-provider AI configuration
- ✅ API key management with secure storage
- ✅ Model availability and pricing configuration
- ✅ Usage analytics and rate limiting controls

#### **4. Email Configuration**
```typescript
email: {
  provider: 'resend' | 'sendgrid' | 'mailgun' | 'smtp';
  apiKey?: string;                 // Email service API key
  fromEmail: string;               // Default sender email
  fromName: string;                // Default sender name
  smtp?: {                         // SMTP configuration
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    secure: boolean;
  };
  templates: {
    welcome: boolean;              // Enable welcome emails
    billing: boolean;              // Enable billing emails
    marketing: boolean;            // Enable marketing emails
  };
}
```

**Admin Interface Features:**
- ✅ Multiple email provider support
- ✅ SMTP configuration for custom providers
- ✅ Email template management
- ✅ Test email functionality

#### **5. Payment Configuration**
```typescript
payments: {
  stripe: {
    publishableKey?: string;       // Stripe publishable key
    secretKey?: string;            // Stripe secret key
    webhookSecret?: string;        // Webhook secret
    enabled: boolean;
  };
  paypal: {
    clientId?: string;             // PayPal client ID
    clientSecret?: string;         // PayPal secret
    enabled: boolean;
  };
  currency: string;                // Default currency
  taxRate: number;                 // Tax rate percentage
}
```

**Admin Interface Features:**
- ✅ Multiple payment gateway support
- ✅ Secure credential management
- ✅ Webhook configuration and testing
- ✅ Currency and tax settings

#### **6. Security Settings**
```typescript
security: {
  rateLimiting: {
    enabled: boolean;              // Enable rate limiting
    requests: number;              // Requests per window
    windowMinutes: number;         // Time window
  };
  cors: {
    enabled: boolean;              // Enable CORS
    origins: string[];             // Allowed origins
  };
  twoFactor: {
    enabled: boolean;              // Enable 2FA
    required: boolean;             // Require 2FA
  };
  passwordPolicy: {
    minLength: number;             // Minimum password length
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
  };
}
```

**Admin Interface Features:**
- ✅ Comprehensive security policy management
- ✅ Rate limiting configuration
- ✅ CORS policy management
- ✅ Password policy enforcement

#### **7. Feature Flags**
```typescript
features: {
  multiAgentSystem: boolean;       // Enable multi-agent AI
  gitIntegration: boolean;         // Enable Git features
  dockerSupport: boolean;          // Enable Docker support
  teamCollaboration: boolean;      // Enable team features
  whiteLabeling: boolean;          // Enable white-label options
  customModels: boolean;           // Enable custom AI models
  advancedAnalytics: boolean;      // Enable advanced analytics
  apiAccess: boolean;              // Enable API access
  autoUpdates: boolean;            // Enable auto-updates
}
```

**Admin Interface Features:**
- ✅ Dynamic feature toggling
- ✅ A/B testing support
- ✅ Gradual feature rollout
- ✅ Feature usage analytics

#### **8. Analytics Configuration**
```typescript
analytics: {
  googleAnalytics: {
    trackingId?: string;           // GA tracking ID
    enabled: boolean;
  };
  posthog: {
    apiKey?: string;               // PostHog API key
    enabled: boolean;
  };
  mixpanel: {
    token?: string;                // Mixpanel token
    enabled: boolean;
  };
}
```

**Admin Interface Features:**
- ✅ Multiple analytics provider support
- ✅ Privacy-compliant tracking configuration
- ✅ Custom event tracking setup
- ✅ Analytics dashboard integration

#### **9. Storage Configuration**
```typescript
storage: {
  provider: 'local' | 's3' | 'gcs' | 'azure';
  s3?: {
    accessKeyId?: string;          // AWS access key
    secretAccessKey?: string;      // AWS secret key
    region: string;                // AWS region
    bucket?: string;               // S3 bucket name
  };
  maxFileSize: number;             // Max file size in bytes
  allowedTypes: string[];          // Allowed MIME types
}
```

**Admin Interface Features:**
- ✅ Multiple storage provider support
- ✅ File upload policies and limits
- ✅ Storage usage analytics
- ✅ CDN configuration

## 🔄 Auto-Update System

### **GitHub Integration**
The auto-update system is directly connected to your GitHub repository:

```typescript
interface UpdateManager {
  // Check for new releases from GitHub
  checkForUpdates(): Promise<UpdateInfo>;
  
  // Install updates with progress tracking
  performUpdate(version: string): Promise<void>;
  
  // Rollback to previous version
  rollbackUpdate(targetVersion: string): Promise<void>;
  
  // Schedule updates for later
  scheduleUpdate(version: string, scheduledTime: Date): Promise<void>;
}
```

### **Update Process Flow**

#### **1. Update Detection**
```mermaid
graph TD
    A[GitHub Webhook] --> B[Check Latest Release]
    B --> C{New Version?}
    C -->|Yes| D[Notify Admin Panel]
    C -->|No| E[Continue Monitoring]
    D --> F[Display Update Available]
```

#### **2. Update Installation**
```mermaid
graph TD
    A[Start Update] --> B[Enable Maintenance Mode]
    B --> C[Download Release]
    C --> D[Backup Current Version]
    D --> E[Install New Version]
    E --> F[Run Migrations]
    F --> G[Restart Services]
    G --> H[Disable Maintenance Mode]
    H --> I[Update Complete]
```

### **Update Features**

#### **Automatic Update Detection**
- ✅ **GitHub Release Monitoring**: Automatically detects new releases
- ✅ **Semantic Versioning**: Understands version precedence
- ✅ **Pre-release Support**: Option to include beta versions
- ✅ **Security Updates**: Priority handling for security patches

#### **Safe Update Process**
- ✅ **Maintenance Mode**: Automatically enables during updates
- ✅ **Backup Creation**: Creates backup before updating
- ✅ **Rollback Support**: One-click rollback to previous version
- ✅ **Progress Tracking**: Real-time update progress monitoring

#### **Update Scheduling**
- ✅ **Scheduled Updates**: Schedule updates for off-peak hours
- ✅ **Update Windows**: Define maintenance windows
- ✅ **Notification System**: Email notifications for updates
- ✅ **Approval Workflow**: Require admin approval for updates

#### **Update History & Monitoring**
- ✅ **Update History**: Complete history of all updates
- ✅ **Changelog Integration**: Display release notes and changes
- ✅ **Update Analytics**: Track update success rates
- ✅ **Error Reporting**: Detailed error logs for failed updates

### **Admin Interface Features**

#### **Update Dashboard**
```typescript
interface UpdateDashboard {
  currentVersion: string;          // Current system version
  latestVersion: string;           // Latest available version
  hasUpdate: boolean;              // Update available flag
  updateSize: number;              // Update download size
  releaseDate: string;             // Release date
  changelog: string;               // Release notes
  isPrerelease: boolean;           // Pre-release flag
}
```

#### **Update Controls**
- ✅ **One-Click Updates**: Install updates with single click
- ✅ **Update Scheduling**: Schedule updates for later
- ✅ **Rollback Options**: Quick rollback to previous versions
- ✅ **Update Testing**: Test updates in staging environment

#### **Progress Monitoring**
```typescript
interface UpdateStatus {
  status: 'idle' | 'checking' | 'downloading' | 'installing' | 'completed' | 'failed';
  progress: number;                // Progress percentage
  message: string;                 // Current status message
  error?: string;                  // Error message if failed
  startedAt?: string;              // Update start time
  completedAt?: string;            // Update completion time
}
```

## 🛠️ Implementation Guide

### **1. Configuration System Setup**

#### **Environment Variables**
```bash
# Database connection for configuration storage
DATABASE_URL="postgresql://username:password@localhost:5432/floraa_config"

# Configuration encryption key
CONFIG_ENCRYPTION_KEY="your-32-character-encryption-key"

# Admin access control
ADMIN_SECRET_KEY="your-admin-secret-key"
```

#### **Database Schema**
```sql
CREATE TABLE configurations (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value JSONB NOT NULL,
  encrypted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(section, key)
);

CREATE TABLE configuration_history (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP DEFAULT NOW()
);
```

### **2. Auto-Update System Setup**

#### **GitHub Webhook Configuration**
```json
{
  "url": "https://your-domain.com/webhooks/github",
  "content_type": "json",
  "events": ["release"],
  "active": true
}
```

#### **Update Storage Structure**
```
/updates/
├── downloads/           # Downloaded update files
├── backups/            # System backups
├── logs/               # Update logs
└── staging/            # Staging area for updates
```

### **3. Security Considerations**

#### **Configuration Security**
- ✅ **Encrypted Storage**: Sensitive configs encrypted at rest
- ✅ **Access Control**: Role-based access to configuration sections
- ✅ **Audit Logging**: All configuration changes logged
- ✅ **Validation**: Input validation and sanitization

#### **Update Security**
- ✅ **Signature Verification**: Verify update signatures
- ✅ **Checksum Validation**: Validate download integrity
- ✅ **Rollback Protection**: Prevent malicious rollbacks
- ✅ **Secure Downloads**: HTTPS-only update downloads

## 📊 Monitoring & Analytics

### **Configuration Monitoring**
- ✅ **Change Tracking**: Monitor all configuration changes
- ✅ **Performance Impact**: Track performance impact of changes
- ✅ **Error Monitoring**: Monitor configuration-related errors
- ✅ **Usage Analytics**: Track feature usage based on configurations

### **Update Monitoring**
- ✅ **Update Success Rate**: Track successful vs failed updates
- ✅ **Update Performance**: Monitor update download and install times
- ✅ **Rollback Frequency**: Track rollback occurrences
- ✅ **System Health**: Monitor system health post-update

## 🚀 Benefits

### **For Administrators**
- **Centralized Control**: Manage everything from one interface
- **Real-Time Changes**: No server restarts required
- **Safe Updates**: Automated backup and rollback capabilities
- **Comprehensive Monitoring**: Full visibility into system changes

### **For Users**
- **Minimal Downtime**: Quick updates with maintenance mode
- **Latest Features**: Always access to newest features
- **Improved Security**: Automatic security updates
- **Better Performance**: Regular performance improvements

### **For Developers**
- **Easy Deployment**: Automated update deployment
- **Configuration Management**: Centralized configuration system
- **Feature Flags**: Easy feature rollout and testing
- **Monitoring Integration**: Built-in monitoring and analytics

This comprehensive configuration and auto-update system ensures that Floraa.dev remains current, secure, and easily manageable while providing administrators with complete control over all system aspects.