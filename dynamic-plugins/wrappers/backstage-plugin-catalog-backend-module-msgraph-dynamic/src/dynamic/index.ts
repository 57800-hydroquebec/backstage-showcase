import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  async catalog(builder, env) {
    builder.addEntityProvider(
      MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        scheduler: env.scheduler,
      }),
    );
  },
};
