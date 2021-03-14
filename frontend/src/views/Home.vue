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

    <!-- USER -->
    <div class="user">
      <!-- <CMSIcons name="user" theme="1"/> -->
      <h2>Olivier E.</h2>
    </div>
    <div>
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
    console.log('--- get editor',editor);
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
    //const editor = await $event;
    console.log('---DBG init editor',editor.t)

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
      console.log('--PHP create', res);
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
      // FIXME load content 
      this.editor.data = data.content;
      console.log('--load', this.editor);


    }catch(err) {
      console.log('--PHP ERROR create', err);
    }
  }

  onSave() {
    //
  }
}
</script>
