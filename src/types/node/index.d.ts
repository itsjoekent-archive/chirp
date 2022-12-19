type StringBoolean = 'true' | 'false';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_DOMAIN: string;
      API_PORT: string;
      IS_LOCAL_DEVELOPMENT: StringBoolean;
      MONGODB_URI: string;
      NODE_ENV: 'development' | 'production';
      REDIS_URL: string;
    }
  }
}

export {};
