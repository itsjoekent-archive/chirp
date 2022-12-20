import pino from 'pino';

type PinoConfig = Parameters<typeof pino>[0];
const isLocalDevelopment = process.env.IS_LOCAL_DEVELOPMENT === 'true';

export default function createLogger(): ReturnType<typeof pino> {
  const localDevelopmentConfig: PinoConfig = {
    transport: {
      target: 'pino-pretty',
    },
  };

  const logger = pino(isLocalDevelopment ? localDevelopmentConfig : {});
  return logger;
}
