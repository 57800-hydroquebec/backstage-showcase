import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { MicrocksApiEntityProvider } from '@microcks/microcks-backstage-provider';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  catalog(builder, env) {
    builder.addEntityProvider(
      MicrocksApiEntityProvider.fromConfig(env.config, {
        logger: env.logger,
        scheduler: env.scheduler,
      }),
    );
  },
};