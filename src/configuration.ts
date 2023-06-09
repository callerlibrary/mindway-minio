import { Configuration } from '@midwayjs/core';
import * as DefaultConfig from './config/config.default';
import { MinioService } from './service/minio.service';

@Configuration({
  namespace: 'minio',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class BookConfiguration {
  async onReady(container) {
    // TODO something
    await container.getAsync(MinioService);
  }
}
