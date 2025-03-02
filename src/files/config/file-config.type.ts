export type FileConfig = {
  maxFileSize: number;
  minio: {
    endpoint?: string;
    publicEndpoint?: string;
    port?: number;
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    ssl?: boolean;
  };
};
