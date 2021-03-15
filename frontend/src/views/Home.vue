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
      <input type="text" placeholder="slug" v-model="slug" />
      <button @click="onCreate">create</button>
      <button @click="onLoad">load</button>
    </div>

    <editor class="editor" ref="editor" :config="editorCfg" :initialized="onInitialized"/>    

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

import { Editor } from 'vue-editor-js/src/index';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import SimpleImage from '@editorjs/simple-image'

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
    Editor, 
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
  published = false;

  get editorCfg() {
    return {
        autofocus: true,
        /**
         * This Tool will be used as default
         */
        initialBlock: "paragraph",
        tools: {
          header: {
            class: Header
          },
          list: {
            class: List
          },
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
          code: {
            class: CodeTool
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                imgur: true
              }
            }
          },
          checklist: {
            class: Checklist,
          },
          Marker: {
            class: Marker,
            shortcut: 'CMD+SHIFT+M',
          },
          raw: RawTool,
          image: SimpleImage,
        },
        onReady: function() {
          console.log("editorjs -- ready");
        },
        onChange: function(elem) {
          console.log("editorjs -- change",elem);

          elem.saver.save().then((savedData) => {
            console.log("editorjs -- save",savedData)
            // this.value = savedData
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


  async onInitialized(editor) {
    if(this.$route.params.slug){
      this.slug = this.$route.params.slug;
      setTimeout(()=>this.onLoad(),500);
    }

    //
  }

  async onCreate() {
    try{
      const data = await this.editor.save();
      
      // slug
      // content
      // version
      // published
      // time
      const page ={
        fr:data.blocks,
        en:[]
      };
      const content = {
        slug:this.slug,
        content: page,
        version: data.version,
        time: data.time,
        published: this.published,
      } as CMS.Editor;
      console.log("editorjs -- save 2",content)
      const res = await $editor.create(content);
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
      this.slug = data.slug;
      this.published = !!data.published;
      // FIXME load content 
      //this.editor.configuration.data.blocks = data.content.fr;
      this.editor.blocks.render({blocks:data.content.fr});
      console.log('--load', this.editor.blocks);


    }catch(err) {
      console.log('--PHP ERROR create', err);
    }
  }

  onSave() {
    //
  }
}
</script>
