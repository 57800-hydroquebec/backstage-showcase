import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node';
import { loggerToWinstonLogger } from '@backstage/backend-common';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: createBackendModule({
    moduleId: 'catalog-backend-module-msgraph',
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
            ...MicrosoftGraphOrgEntityProvider.fromConfig(config, {
              logger: loggerToWinstonLogger(logger),
              scheduler: scheduler,
            }),
          );
        },
      });
    },
  }),
};
