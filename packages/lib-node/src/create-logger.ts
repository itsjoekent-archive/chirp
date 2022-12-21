import pino from 'pino';

type PinoConfig = Parameters<typeof pino>[0];

export default function createLogger(
  isLocalDevelopment: boolean
): ReturnType<typeof pino> {
  const localDevelopmentConfig: PinoConfig = {
    transport: {
      target: 'pino-pretty',
    },
  };

  const logger = pino(isLocalDevelopment ? localDevelopmentConfig : {});
  return logger;
}
