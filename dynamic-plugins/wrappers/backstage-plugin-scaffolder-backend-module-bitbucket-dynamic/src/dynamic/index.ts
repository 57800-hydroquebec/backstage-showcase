import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { createPublishBitbucketPRAction } from './actions/createBitbucketPRAction';
import { ScmIntegrations } from '@backstage/integration';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  scaffolder(env) {
    const integrations = ScmIntegrations.fromConfig(env.config);
    const config = env.config;
    return [createPublishBitbucketPRAction({integrations, config})];
  }, 
};
