import { Configuration, IMidwayContainer } from '@midwayjs/core';
import * as DefaultConfig from './config/config.default';
import * as ProdConfig from './config/config.prod';
import * as LocalConfig from './config/config.local';
import * as DevelopmentConfig from './config/config.development';
import { MinioService } from './service/minio.service';

@Configuration({
  namespace: 'minio',
  importConfigs: [
    {
      default: DefaultConfig,
      local: LocalConfig,
      development: DevelopmentConfig,
      prod: ProdConfig,
    },
  ],
})
export class MinioConfiguration {
  async onReady(container: IMidwayContainer) {
    // TODO something
    await container.getAsync(MinioService);
  }
}
