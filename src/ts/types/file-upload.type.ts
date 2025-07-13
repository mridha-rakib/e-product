export interface IFile {
  path?: string;
}

export interface IUploadResult {
  url: string;
  public_id: string;
}

export interface IRequest {
  file?: IFile;
  body: any;
}
