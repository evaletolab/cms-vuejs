/* eslint-disable */
// TODO: discuss i18n with client
export namespace CMS {
  
  export enum AssetType
  {
      PNG = 'image/png',
      SVG = 'image/svg+xml',
      JPG = 'image/jpeg',
      MP4 = 'video/mp4',
      MP3 = 'audio/mpeg'
  }

  export interface Asset {
      type: AssetType;
      url: string;
  }

  export interface Config {
    version: string;
    themes: any;
  }

  //
  // user
  export interface User {
    id: string | false;
    name: string;
    created: Date;
    updated?: Date;
  }

  export interface Editor {
    block: any[];
    version: string;
    time: Date|number;
    published: boolean;
    slug: string;
  }
  
}

