import { CMS } from "@/models";

import { Vue } from 'vue-property-decorator';

import { $config } from "./config-service";
import { $user } from "./user-service";


import axios from 'axios';

const defaultAxios = {
  headers: { 
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer abcd'
  }
};



class EditorService {
  public STORAGE_KEY = "cms-progression";

  public cms: any = {};

  constructor() {
    this.cms = Vue.observable({});
  }

  //
  // create editor content  
  async create(content: CMS.Editor){
    if(!content.slug || content.published == undefined) {
      throw new Error('Missing params for saving content');
    }

    const user = await $user.get();

    //
    // save php
    const data = {
      slug: content.slug,
      content: content.content,
      time: content.time,
      version: content.version,
      published: content.published,
      lang: content.lang
    };
    await axios.post("/editor", data, defaultAxios);

    this.cms[content.slug] = content;
    console.log('---DBG localStorage',this.cms);
    await $config.storageSet(this.STORAGE_KEY,content);

    return content;
  }

  //
  // save editor version 
  async save(content: CMS.Editor){
    if(!content.slug || content.published == undefined) {
      throw new Error('Missing params for saving content');
    }

    const user = await $user.get();

    //
    // save php
    const data = {
      content: content.content,
      time: content.time,
      version: content.version,
      published: content.published,
      lang: content.lang
    };
    await axios.post("/editor/" + content.slug, data, defaultAxios);

    this.cms[content.slug] = content;
    console.log('---DBG localStorage',this.cms);
    await $config.storageSet(this.STORAGE_KEY,content);

    return content;
  }

  async load(slug: string, published: boolean, lang?: string) {
    const user = await $user.get();
    const config = Object.assign({},defaultAxios) as any;
    config.params = {
      published,
      lang
    };

    //
    // load Airtable usage
    const res= await axios.get("/editor/" + slug, config);
    console.log('-- DBG',res);
    return res;
  }
}

//
// service start with $
export const $editor = new EditorService();