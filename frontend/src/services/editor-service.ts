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
    const result = await axios.post("/editor", content, defaultAxios) as any;
    content.id = result.id;

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
    await axios.put("/editor/" + content.slug, content, defaultAxios);

    this.cms[content.slug] = content;
    console.log('---DBG localStorage',this.cms);
    await $config.storageSet(this.STORAGE_KEY,content);

    return content;
  }

  async load(slug: string, published: boolean, lang?: string){
    const user = await $user.get();
    const config = Object.assign({},defaultAxios) as any;
    config.params = {
      published
    };

    //
    // load Airtable usage
    const data= (await axios.get("/editor/" + slug, config)).data;
    if(data && data.content){
      data.content = JSON.parse(data.content);
    }
    return data;
  }
}

//
// service start with $
export const $editor = new EditorService();