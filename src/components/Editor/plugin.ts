import { METHOD } from 'global';
import { fetcher } from 'utils/restApi';
export class ImageUploadAdapter {
  private loader: any;
  private token?: string;
  constructor(loader: any, token?: string) {
    this.loader = loader;
    this.token = token;
  }
  upload = async () => {
    const file = await this.loader.file;
    const formData = new FormData();
    formData.append('file', file!);
    try {
      const res = await fetcher(
        '/api/v1/upload?type=BLOG',
        METHOD.POST,
        formData,
        {
          Authorization: `Bearer ${this.token}`,
        },
      );
      return {
        default: res.result?.filePath,
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  };
  abort() {}
}
