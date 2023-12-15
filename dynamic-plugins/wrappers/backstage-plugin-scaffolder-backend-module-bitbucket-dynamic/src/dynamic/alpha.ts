import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { createRunYeomanAction } from '@backstage/plugin-scaffolder-backend-module-yeoman';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'new',
  install: createBackendModule({
    moduleId: 'scaffolder-backend-yeoman',
    pluginId: 'scaffolder',
    register(env) {
      env.registerInit({
        deps: {
          scaffolder: scaffolderActionsExtensionPoint,
          discovery: coreServices.discovery,
        },
        async init({ scaffolder }) {
          for (const action of [createRunYeomanAction]) {
            scaffolder.addActions(action());
          }
        },
      });
    },
  }),
};
