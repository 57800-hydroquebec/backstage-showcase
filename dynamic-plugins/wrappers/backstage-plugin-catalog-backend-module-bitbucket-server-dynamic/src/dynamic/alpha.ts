import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { BitbucketServerEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-server';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { loggerToWinstonLogger } from '@backstage/backend-common';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: createBackendModule({
    moduleId: 'catalog-backend-module-bitbucket-server',
    pluginId: 'catalog',
    register(env) {
      env.registerInit({
        deps: {
          catalog: catalogProcessingExtensionPoint,
          config: coreServices.rootConfig,
          logger: coreServices.logger,
          scheduler: coreServices.scheduler,
        },
        async init({ catalog, config, logger, scheduler }) {
          catalog.addEntityProvider(
            ...BitbucketServerEntityProvider.fromConfig(config, {
              logger: loggerToWinstonLogger(logger),
              schedule: scheduler.createScheduledTaskRunner({
                frequency: { minutes: 30 },
                timeout: { minutes: 3 },
              }),
              scheduler: scheduler,
            }),
          );
        },
      });
    },
  }),
};
