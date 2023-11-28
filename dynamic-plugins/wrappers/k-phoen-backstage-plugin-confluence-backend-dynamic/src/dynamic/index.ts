import { BackendDynamicPluginInstaller } from '@backstage/backend-plugin-manager';
import { ConfluenceCollatorFactory } from '@k-phoen/backstage-plugin-confluence-backend';
import { readTaskScheduleDefinitionFromConfig } from '@backstage/backend-tasks';

export const dynamicPluginInstaller: BackendDynamicPluginInstaller = {
  kind: 'legacy',
  search(indexBuilder, schedule, env) {
    const confluenceSchedule = env.config.has('confluence.schedule')
      ? env.scheduler.createScheduledTaskRunner(
          readTaskScheduleDefinitionFromConfig(
            env.config.getConfig('confluence.schedule'),
          ),
        )
      : schedule;

    indexBuilder.addCollator({
      schedule: confluenceSchedule,
      factory: ConfluenceCollatorFactory.fromConfig(env.config, {
        logger: env.logger,
      }),
    });
  },
};
