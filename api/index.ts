import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

let app: Awaited<ReturnType<typeof NestFactory.create>> | null = null;

async function getApp() {
  if (!app) {
    app = await NestFactory.create(AppModule, { logger: false });
    app.enableCors();
    await app.init();
  }
  return app;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const nestApp = await getApp();
  const httpAdapter = nestApp.getHttpAdapter();
  const instance = httpAdapter.getInstance() as (
    req: IncomingMessage,
    res: ServerResponse,
  ) => void;
  instance(req, res);
}
