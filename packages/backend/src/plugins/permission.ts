import { Router } from 'express';
import { PluginEnvironment } from '../types';
import {
  PolicyBuilder,
  PluginIdProvider,
} from '@janus-idp/backstage-plugin-rbac-backend';

export default async function createPlugin(
  env: PluginEnvironment,
  pluginIdProvider?: PluginIdProvider | undefined,
): Promise<Router> {
  return await PolicyBuilder.build(
    {
      config: env.config,
      logger: env.logger,
      discovery: env.discovery,
      database: env.database,
      identity: env.identity,
      permissions: env.permissions,
      tokenManager: env.tokenManager,
    },
    pluginIdProvider,
  );
}
