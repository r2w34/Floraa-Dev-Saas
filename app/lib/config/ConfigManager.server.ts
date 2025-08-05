import { z } from 'zod';

// Configuration schema for validation
export const ConfigSchema = z.object({
  // Application Settings
  app: z.object({
    name: z.string().default('Floraa.dev'),
    url: z.string().url().default('http://localhost:5173'),
    description: z.string().default('AI-powered web development platform'),
    logo: z.string().url().optional(),
    favicon: z.string().url().optional(),
    maintenanceMode: z.boolean().default(false),
    maintenanceMessage: z.string().default('We are currently performing maintenance. Please check back soon.'),
  }),

  // Authentication Settings
  auth: z.object({
    github: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      callbackUrl: z.string().url().optional(),
      enabled: z.boolean().default(true),
    }),
    session: z.object({
      secret: z.string().min(32),
      maxAge: z.number().default(30 * 24 * 60 * 60), // 30 days
      secure: z.boolean().default(true),
    }),
    registration: z.object({
      enabled: z.boolean().default(true),
      requireEmailVerification: z.boolean().default(true),
      defaultPlan: z.enum(['free', 'pro', 'enterprise']).default('free'),
    }),
  }),

  // AI Model Settings
  ai: z.object({
    providers: z.object({
      openai: z.object({
        apiKey: z.string().optional(),
        enabled: z.boolean().default(false),
        models: z.array(z.string()).default(['gpt-4', 'gpt-3.5-turbo']),
      }),
      anthropic: z.object({
        apiKey: z.string().optional(),
        enabled: z.boolean().default(false),
        models: z.array(z.string()).default(['claude-3-5-sonnet', 'claude-3-haiku']),
      }),
      google: z.object({
        apiKey: z.string().optional(),
        enabled: z.boolean().default(false),
        models: z.array(z.string()).default(['gemini-pro', 'gemini-pro-vision']),
      }),
    }),
    defaultModel: z.string().default('claude-3-5-sonnet'),
    rateLimiting: z.object({
      enabled: z.boolean().default(true),
      requestsPerMinute: z.number().default(60),
      requestsPerHour: z.number().default(1000),
    }),
  }),

  // Email Settings
  email: z.object({
    provider: z.enum(['resend', 'sendgrid', 'mailgun', 'smtp']).default('resend'),
    apiKey: z.string().optional(),
    fromEmail: z.string().email().default('noreply@floraa.dev'),
    fromName: z.string().default('Floraa.dev'),
    smtp: z.object({
      host: z.string().optional(),
      port: z.number().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
      secure: z.boolean().default(true),
    }).optional(),
    templates: z.object({
      welcome: z.boolean().default(true),
      billing: z.boolean().default(true),
      marketing: z.boolean().default(false),
    }),
  }),

  // Payment Settings
  payments: z.object({
    stripe: z.object({
      publishableKey: z.string().optional(),
      secretKey: z.string().optional(),
      webhookSecret: z.string().optional(),
      enabled: z.boolean().default(false),
    }),
    paypal: z.object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      enabled: z.boolean().default(false),
    }),
    currency: z.string().default('USD'),
    taxRate: z.number().default(0),
  }),

  // Security Settings
  security: z.object({
    rateLimiting: z.object({
      enabled: z.boolean().default(true),
      requests: z.number().default(100),
      windowMinutes: z.number().default(15),
    }),
    cors: z.object({
      enabled: z.boolean().default(true),
      origins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:5173']),
    }),
    twoFactor: z.object({
      enabled: z.boolean().default(true),
      required: z.boolean().default(false),
    }),
    passwordPolicy: z.object({
      minLength: z.number().default(8),
      requireUppercase: z.boolean().default(true),
      requireLowercase: z.boolean().default(true),
      requireNumbers: z.boolean().default(true),
      requireSymbols: z.boolean().default(false),
    }),
  }),

  // Feature Flags
  features: z.object({
    multiAgentSystem: z.boolean().default(true),
    gitIntegration: z.boolean().default(true),
    dockerSupport: z.boolean().default(true),
    teamCollaboration: z.boolean().default(false),
    whiteLabeling: z.boolean().default(false),
    customModels: z.boolean().default(false),
    advancedAnalytics: z.boolean().default(true),
    apiAccess: z.boolean().default(true),
    autoUpdates: z.boolean().default(true),
  }),

  // Analytics Settings
  analytics: z.object({
    googleAnalytics: z.object({
      trackingId: z.string().optional(),
      enabled: z.boolean().default(false),
    }),
    posthog: z.object({
      apiKey: z.string().optional(),
      enabled: z.boolean().default(false),
    }),
    mixpanel: z.object({
      token: z.string().optional(),
      enabled: z.boolean().default(false),
    }),
  }),

  // Storage Settings
  storage: z.object({
    provider: z.enum(['local', 's3', 'gcs', 'azure']).default('local'),
    s3: z.object({
      accessKeyId: z.string().optional(),
      secretAccessKey: z.string().optional(),
      region: z.string().default('us-east-1'),
      bucket: z.string().optional(),
    }).optional(),
    maxFileSize: z.number().default(10 * 1024 * 1024), // 10MB
    allowedTypes: z.array(z.string()).default(['image/*', 'text/*', 'application/json']),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  private listeners: Set<(config: Config) => void> = new Set();

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private loadConfig(): Config {
    // In a real implementation, this would load from database
    // For now, we'll use environment variables as fallback
    const envConfig = {
      app: {
        name: process.env.APP_NAME || 'Floraa.dev',
        url: process.env.APP_URL || 'http://localhost:5173',
        description: process.env.APP_DESCRIPTION || 'AI-powered web development platform',
        maintenanceMode: process.env.MAINTENANCE_MODE === 'true',
        maintenanceMessage: process.env.MAINTENANCE_MESSAGE || 'We are currently performing maintenance. Please check back soon.',
      },
      auth: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackUrl: process.env.GITHUB_CALLBACK_URL,
          enabled: process.env.GITHUB_AUTH_ENABLED !== 'false',
        },
        session: {
          secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
          maxAge: parseInt(process.env.SESSION_MAX_AGE || '2592000'), // 30 days
          secure: process.env.NODE_ENV === 'production',
        },
        registration: {
          enabled: process.env.REGISTRATION_ENABLED !== 'false',
          requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
          defaultPlan: (process.env.DEFAULT_PLAN as 'free' | 'pro' | 'enterprise') || 'free',
        },
      },
      ai: {
        providers: {
          openai: {
            apiKey: process.env.OPENAI_API_KEY,
            enabled: !!process.env.OPENAI_API_KEY,
            models: ['gpt-4', 'gpt-3.5-turbo'],
          },
          anthropic: {
            apiKey: process.env.ANTHROPIC_API_KEY,
            enabled: !!process.env.ANTHROPIC_API_KEY,
            models: ['claude-3-5-sonnet', 'claude-3-haiku'],
          },
          google: {
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            enabled: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
            models: ['gemini-pro', 'gemini-pro-vision'],
          },
        },
        defaultModel: process.env.DEFAULT_MODEL || 'claude-3-5-sonnet',
        rateLimiting: {
          enabled: process.env.AI_RATE_LIMITING_ENABLED !== 'false',
          requestsPerMinute: parseInt(process.env.AI_REQUESTS_PER_MINUTE || '60'),
          requestsPerHour: parseInt(process.env.AI_REQUESTS_PER_HOUR || '1000'),
        },
      },
      email: {
        provider: (process.env.EMAIL_PROVIDER as 'resend' | 'sendgrid' | 'mailgun' | 'smtp') || 'resend',
        apiKey: process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY || process.env.MAILGUN_API_KEY,
        fromEmail: process.env.FROM_EMAIL || 'noreply@floraa.dev',
        fromName: process.env.FROM_NAME || 'Floraa.dev',
        templates: {
          welcome: process.env.WELCOME_EMAIL_ENABLED !== 'false',
          billing: process.env.BILLING_EMAIL_ENABLED !== 'false',
          marketing: process.env.MARKETING_EMAIL_ENABLED === 'true',
        },
      },
      payments: {
        stripe: {
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
          secretKey: process.env.STRIPE_SECRET_KEY,
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
          enabled: !!process.env.STRIPE_SECRET_KEY,
        },
        paypal: {
          clientId: process.env.PAYPAL_CLIENT_ID,
          clientSecret: process.env.PAYPAL_CLIENT_SECRET,
          enabled: !!process.env.PAYPAL_CLIENT_ID,
        },
        currency: process.env.CURRENCY || 'USD',
        taxRate: parseFloat(process.env.TAX_RATE || '0'),
      },
      security: {
        rateLimiting: {
          enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
          requests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
          windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW || '15'),
        },
        cors: {
          enabled: process.env.ENABLE_CORS !== 'false',
          origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
        },
        twoFactor: {
          enabled: process.env.ENABLE_2FA !== 'false',
          required: process.env.REQUIRE_2FA === 'true',
        },
        passwordPolicy: {
          minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
          requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
          requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
          requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
          requireSymbols: process.env.PASSWORD_REQUIRE_SYMBOLS === 'true',
        },
      },
      features: {
        multiAgentSystem: process.env.ENABLE_MULTI_AGENT_SYSTEM !== 'false',
        gitIntegration: process.env.ENABLE_GIT_INTEGRATION !== 'false',
        dockerSupport: process.env.ENABLE_DOCKER_SUPPORT !== 'false',
        teamCollaboration: process.env.ENABLE_TEAM_COLLABORATION === 'true',
        whiteLabeling: process.env.ENABLE_WHITE_LABELING === 'true',
        customModels: process.env.ENABLE_CUSTOM_MODELS === 'true',
        advancedAnalytics: process.env.ENABLE_ADVANCED_ANALYTICS !== 'false',
        apiAccess: process.env.ENABLE_API_ACCESS !== 'false',
        autoUpdates: process.env.ENABLE_AUTO_UPDATES !== 'false',
      },
      analytics: {
        googleAnalytics: {
          trackingId: process.env.GOOGLE_ANALYTICS_ID,
          enabled: !!process.env.GOOGLE_ANALYTICS_ID,
        },
        posthog: {
          apiKey: process.env.POSTHOG_API_KEY,
          enabled: !!process.env.POSTHOG_API_KEY,
        },
        mixpanel: {
          token: process.env.MIXPANEL_TOKEN,
          enabled: !!process.env.MIXPANEL_TOKEN,
        },
      },
      storage: {
        provider: (process.env.STORAGE_PROVIDER as 'local' | 's3' | 'gcs' | 'azure') || 'local',
        s3: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION || 'us-east-1',
          bucket: process.env.AWS_BUCKET_NAME,
        },
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
        allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/*', 'text/*', 'application/json'],
      },
    };

    return ConfigSchema.parse(envConfig);
  }

  public getConfig(): Config {
    return this.config;
  }

  public async updateConfig(updates: Partial<Config>): Promise<void> {
    const newConfig = { ...this.config, ...updates };
    const validatedConfig = ConfigSchema.parse(newConfig);
    
    // In a real implementation, save to database here
    await this.saveConfigToDatabase(validatedConfig);
    
    this.config = validatedConfig;
    this.notifyListeners();
  }

  public subscribe(listener: (config: Config) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }

  private async saveConfigToDatabase(config: Config): Promise<void> {
    // TODO: Implement database save
    console.log('Saving config to database:', config);
  }

  // Helper methods for common config access
  public isMaintenanceMode(): boolean {
    return this.config.app.maintenanceMode;
  }

  public isFeatureEnabled(feature: keyof Config['features']): boolean {
    return this.config.features[feature];
  }

  public getAIProvider(provider: keyof Config['ai']['providers']) {
    return this.config.ai.providers[provider];
  }

  public getPaymentProvider(provider: keyof Config['payments']) {
    return this.config.payments[provider];
  }
}

export const configManager = ConfigManager.getInstance();