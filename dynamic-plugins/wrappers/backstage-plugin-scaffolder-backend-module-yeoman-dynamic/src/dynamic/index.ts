import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { createRunYeomanAction } from '@backstage/plugin-scaffolder-backend-module-yeoman';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  scaffolder: () => [createRunYeomanAction()],
};
