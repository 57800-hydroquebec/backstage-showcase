import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { BitbucketServerEntityProvider } from '@backstage/plugin-catalog-backend-module-bitbucket-server';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  async catalog(builder, env) {
    builder.addEntityProvider(
      BitbucketServerEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        scheduler: env.scheduler,
      }),
    );
  },
};
