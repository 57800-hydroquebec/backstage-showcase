/*
 * Copyright 2021 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Git } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { assertError } from '@backstage/errors';
import { Octokit } from 'octokit';
import { Logger } from 'winston';
import fs from 'fs-extra';

export async function commitAndPushBranch({
  tempDir,
  dir,
  remoteUrl,
  auth,
  logger,
  commitMessage,
  gitAuthorInfo,
  branch = 'master',
  remoteRef,
}: {
  tempDir: string;
  dir: string;
  remoteUrl: string;
  // For use cases where token has to be used with Basic Auth
  // it has to be provided as password together with a username
  // which may be a fixed value defined by the provider.
  auth: { username: string; password: string } | { token: string };
  logger: Logger;
  commitMessage: string;
  gitAuthorInfo?: { name?: string; email?: string };
  branch?: string;
  remoteRef?: string;
}): Promise<{ commitHash: string }> {
  const git = Git.fromAuth({
    ...auth,
    logger,
  });

  logger.info(
    `commitAndPushBranch tempDir:${tempDir} dir:${dir} branch:${branch} remoteUrl:${remoteUrl}`,
  );

  await git.clone({ url: remoteUrl, dir: tempDir });
  await git.fetch({ dir: tempDir });
  await git.checkout({ dir: tempDir, ref: branch });

  // copy files
  fs.cpSync(dir, tempDir, {
    recursive: true,
    filter: function (path) {
      return !(path.indexOf('.git') > -1);
    },
  });

  await git.add({ dir: tempDir, filepath: '.' });

  // use provided info if possible, otherwise use fallbacks
  const authorInfo = {
    name: gitAuthorInfo?.name ?? 'Scaffolder',
    email: gitAuthorInfo?.email ?? 'scaffolder@backstage.io',
  };

  const commitHash = await git.commit({
    dir: tempDir,
    message: commitMessage,
    author: authorInfo,
    committer: authorInfo,
  });

  await git.push({
    dir: tempDir,
    remote: 'origin',
    remoteRef: remoteRef ?? `refs/heads/${branch}`,
  });

  return { commitHash };
}
