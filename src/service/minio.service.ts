import { Provide, Scope, ScopeEnum, Config, Init } from '@midwayjs/core';
import * as minio from 'minio';

interface MinioClientOptions extends minio.ClientOptions {
  bucket: string;
  endPoint: string;
  accessKey: string;
  secretKey: string;
  useSSL?: boolean | undefined;
  port?: number | undefined;
  transport?: any;
  sessionToken?: string | undefined;
  partSize?: number | undefined;
  pathStyle?: boolean | undefined;
}

@Provide()
@Scope(ScopeEnum.Singleton)
export class MinioService {
  minioClient: minio.Client;

  @Config('minio')
  minioConfig: minio.ClientOptions;

  @Config('minio')
  AddOnConfiguration: MinioClientOptions;

  @Init()
  async init() {
    this.minioClient = new minio.Client(this.minioConfig);
    console.log('minio work success !!!! ');
    const e = await this.isExists(this.AddOnConfiguration.bucket);
    if (!e) {
      this.createBucket(this.AddOnConfiguration.bucket, 'cn-north-1');
    }
  }
  /**
   * 判断桶是否存在
   * @param name 桶名称
   */
  async isExists(name: string) {
    return new Promise((resolve, reject) => {
      this.minioClient.bucketExists(name, (err, exists) => {
        if (err) {
          console.error('isExists err:', err);
          return reject(err);
        }
        console.log('Results of isExists, exists is: ', exists);
        resolve(exists);
      });
    });
  }

  /**
   * 创建桶
   * @param name 桶名称
   * @param region 时区
   */
  async createBucket(name: string, region: string) {
    const exists = await this.isExists(name);
    if (exists) return name;
    return new Promise((resolve, reject) => {
      this.minioClient.makeBucket(name, region, err => {
        if (err) {
          console.error('createBucket err :', err);
          return reject(err);
        }
        console.log('createBucket: true');
        resolve(true);
      });
    });
  }

  /**
   * 列出所有桶
   */
  async listBuckets() {
    return new Promise((resolve, reject) => {
      this.minioClient.listBuckets((err, buckets) => {
        if (err) {
          console.error('listBuckets err :', err);
          return reject(err);
        }
        console.log('bucketsList :', buckets);
        resolve(buckets);
      });
    });
  }

  /**
   * 删除桶
   * @param name 桶名称
   */
  async removeBucket(name: string) {
    const exists = await this.isExists(name);
    if (!exists) return name;
    return new Promise((resolve, reject) => {
      this.minioClient.removeBucket(name, err => {
        if (err) {
          console.error('removeBucket err :', err);
          return reject(err);
        }
        console.log('Bucket removed successfully.');
        resolve(true);
      });
    });
  }

  /**
   * 从stream上传文件
   * @param bucket 桶名称
   * @param fileName 文件名称
   * @param stream 文件流
   * @param size 文件大小
   * @param metaData 文件元数据
   */
  async putObjectFromStream(
    bucket: string,
    fileName: string,
    stream: any,
    size?: number,
    metaData?: minio.ItemBucketMetadata
  ) {
    return await this.minioClient.putObject(
      bucket,
      fileName,
      stream,
      size,
      metaData
    );
  }

  /**
   * 删除文件
   * @param bucket 桶名称
   * @param fileName 文件名称
   */
  async removeObject(bucket: string, fileName: string) {
    return await this.minioClient.removeObject(bucket, fileName);
  }

  /**
   * 列出桶中的所有对象
   * @param bucket 桶名称
   * @param prefix 前缀
   * @param recursive 是否递归
   */
  async listObjects(bucket: string, prefix?: string, recursive?: boolean) {
    return new Promise(resolve => {
      const list = this.minioClient.listObjects(bucket, prefix, recursive);
      resolve(list);
    });
  }

  /**
   * 生成一个带有签名的URL
   * @param httpMethod 请求方法
   * @param bucket 桶名称
   * @param fileName 文件名称
   * @param expires 过期时间
   * @param reqParams 请求参数
   */
  async presignedUrl(
    httpMethod: string,
    bucket: string,
    fileName: string,
    expires?: number,
    reqParams?: { [key: string]: any }
  ) {
    return await this.minioClient.presignedUrl(
      httpMethod,
      bucket,
      fileName,
      expires,
      reqParams
    );
  }
}
