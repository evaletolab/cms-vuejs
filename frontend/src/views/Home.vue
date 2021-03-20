<template>
  <div class="home">
    <!-- TOOLBAR -->
    <nav class="toolbar " :class="{'exited': (scrollDirection <= 0) }">
      <div class="toolbar-row">
        <div class="toolbar-section-start">
          <button class="icon start">
            <CMSIcons name="home" color="black"/>
          </button>
        </div>

        <div class="toolbar-title">
          <!-- <img class="logo" src="@/assets/MILID-logo-text.svg" /> -->
        </div>        

        <div class="toolbar-section-end">
          <button class="icon end">
            <CMSIcons name="parametres" color="black"/>
          </button>
        </div>
      </div>

      <div class="toolbar-row">
      </div>        
    </nav>

    <div class="document">
      <h3>Meta</h3>
      <input v-model="meta.type" type="text" placeholder="document type"/>
      <input v-model="meta.title" type="text" placeholder="title"/>
      <input v-model="meta.tags" type="text" placeholder="tag,tag,tag"/>
      <select v-model="lang" @change="onChange">
        <option>fr</option>
        <option>en</option>
        <option>de</option>
      </select>
      <button @click="onCreate" v-show="canCreate">create</button>
    </div>

    <editor class="editor" ref="editor" :config="editorCfg" />    

    <ContentList />
    <!-- FULLSCREEN MODAL -->
    <router-view name="l2"/>

  </div>
</template>

<style lang="scss" scoped>
   @import "./Home.scss";
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { CMS } from "../models";
import { $config, $editor } from '../services';

import CMSIcons from '../components/CMSIcons.vue';
import ContentList from "../components/ContentList.vue";

import { Editor } from 'vue-editor-js/src/index';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import SimpleImage from 'simple-image-editorjs'

import CodeTool from '@editorjs/code'
import Embed from '@editorjs/embed'
import Checklist from '@editorjs/checklist'
import Marker from '@editorjs/marker'
import RawTool from '@editorjs/raw'

// import Warning from '@editorjs/warning'
// import Quote from '@editorjs/quote'
// import InlineCode from '@editorjs/inline-code'
// import Delimiter from '@editorjs/delimiter'

@Component({
  components: {
    ContentList,
    Editor, 
    Embed,
    Header,
    List,
    Paragraph,
    Table,
    SimpleImage,
    CMSIcons 
  }
})
export default class Home extends Vue {
  private lastScrollTop = 0;

  scrollDirection = 0;
  slug = "";
  id = 0;
  lang = $config.lang;
  published = false;
  canCreate = false;
  meta = {
    title: '',
    tags: '',
    type: ''
  };
  content = {};

  get editorCfg() {
    return {
        autofocus: true,
        /**
         * This Tool will be used as default
         */
        initialBlock: "paragraph",
        tools: {
          header: Header,
          list: List,
          paragraph: {
            class: Paragraph,
            config: {
              placeholder: "."
            }
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          code: CodeTool,
          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                vimeo: true,
                imgur: true,
                twitter: true,
                //<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22087.28175302798!2d6.123746201884307!3d46.21224098516061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c650693d0e2eb%3A0xa0b695357b0bbc39!2zR2Vuw6h2ZQ!5e0!3m2!1sfr!2sch!4v1616143566937!5m2!1sfr!2sch" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
                gps:{
                  regex: /^map:([0-9.]+),([0-9.]+)(,([0-9.]+)z)?$/,
                  embedUrl: 'https://maps.googleapis.com/maps/api/staticmap?<%= remote_id %>&size=400x400&key=AIzaSyAxFBNbe50-8F4K07uRx1OlGahEAV-XLt0',
                  html: '<img>',
                  height: 300,
                  width: 600,
                  id: (groups) => {
                    const zoom =(groups.length>2)? groups[3]:'';
                    const params= `center=${groups[0]},${groups[1]}&zoom=${zoom}`;
                    return params;
                  }
                }
              }
            }
          },
          checklist: {
            class: Checklist,
          },
          Marker: {
            class: Marker
          },
          raw: RawTool,
          image: SimpleImage,
        },
        onReady: () => {
          console.log("editorjs -- ready");
          if(!this.slug){
            return;
          }
          this.onLoad();
        },
        onChange: (elem) => {
          elem.saver.save().then(() => {
            if(this.id) {
              this.onSave();
              return;
            }
            //
            // ready to create
            if([this.meta.type,this.meta.title,this.meta.tags].indexOf('') > -1){
              return;
            }
            this.canCreate = true;
          });
        }
      };
  }

  get config(){
    return $config.store.config;
  }

  // image 
  // --> https://github.com/ChangJoo-Park/vue-editor-js-imageserver/blob/master/index.js
  get editor(){
    const editor = this.$refs.editor as any;
    return editor._data.state.editor; 
  }


  themeTertiary(theme) {
    return this.config.themes[theme].tertiary;
  }

  beforeRouteEnter(to: Route, from: Route, next: any) {
    next()
  }

  mounted(){
    this.slug = this.$route.params.slug;
    window.addEventListener("scroll", () => { 
      const st = window.pageYOffset || document.documentElement.scrollTop;
      //
      // downscroll code
      if (st > this.lastScrollTop){
        this.scrollDirection = 1;
      } 
      //
      // upscroll code
      else {          
        this.scrollDirection = -1;
      }

      //
      // For Mobile or negative scrolling
      this.lastScrollTop = st <= 0 ? 0 : st; 

    }, false);    
  }


  async onChange($event){
    console.log('---',$event.target.value, this.lang);
    if(!this.content[this.lang].length){
      return;
    }
    this.editor.blocks.render({blocks:this.content[this.lang]});
  }

  async onCreate() {
    try{
      const data = await this.editor.save();
      
      const page ={
        fr:[],
        en:[],
        de:[]
      };
      page[this.lang]=data.blocks;

      const content = {
        meta_type: this.meta.type,
        meta_title: this.meta.title,
        meta_tags: this.meta.tags,
        slug:this.slug,
        content: page,
        version: data.version,
        time: data.time,
        published: this.published,
      } as CMS.Editor;
      console.log("editorjs -- save 2",content)
      const res = await $editor.create(content);
      this.id = res.id || 0;
    }catch(err) {
      console.log('--PHP ERROR create', err);
    }
  }


  async onLoad() {
    try{
      // slug
      // content
      // version
      // published
      // time
      const data = await $editor.load(this.slug,this.published);
      if(!data || !data.content) {
        return;
      }
      this.meta.type = data.meta_type;
      this.meta.title = data.meta_title;
      this.meta.tags = data.meta_tags;
      this.content = data.content;

      this.id = data.id;
      this.slug = data.slug;
      this.published = !!data.published;
      // FIXME load content 
      //this.editor.configuration.data.blocks = data.content.fr;
      this.editor.blocks.render({blocks:this.content[this.lang]});
      console.log('--load', this.editor.blocks);


    }catch(err) {
      console.log('--PHP ERROR create', err);
    }
  }

  async onSave() {
    try{
      const data = await this.editor.save();
      
      //
      // i18n content
      this.content[this.lang]=data.blocks;

      const content = {
        id: this.id,
        slug:this.slug,
        meta_type: this.meta.type,
        meta_title: this.meta.title,
        meta_tags: this.meta.tags,
        content: this.content,
        version: data.version,
        time: data.time,
        published: this.published,
      } as CMS.Editor;
      const res = await $editor.save(content);
    }catch(err) {
      console.log('--PHP ERROR create', err);
    }
  }
}
</script>
