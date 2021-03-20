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

  export interface Page {
    fr: any;
    en: any;
  }
  export interface Table {
    columns: string[];
    rows: string[];
  }

  export type Content = Page | Table ;

  export interface Editor {
    id?:number;
    meta_title: string;
    meta_type: string;
    meta_tags: string;
    slug: string;
    content: Content;
    version: string;
    time: Date|number;
    published: boolean;
  }
  
}

