<template>
  <!--         ---------         -->  
  <!-- TESTING READ-ONLY DISPLAY -->
  <!--         ---------         -->  
  <div class="content">
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
    <Editor class="editor" ref="editor" :config="editorCfg" :initialized="onInitialized" id="content-html"/>    

  </div>
</template>

<style lang="scss" scoped>
  .content{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    background: white;
    margin: 0;
    z-index: 2;
    height: 100vh;
    width: 100vw;    
    padding-top:0;    
  }

  .editor{
    background-color: #fff!important;
    padding: 15px;
    text-align: left;
    margin-top: 60px;
  }


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


@Component({
  components: {
    CMSIcons,
    Editor
  }
})
export default class Content extends Vue {
  private lastScrollTop = 0;
  scrollDirection = 0;

  get editorCfg() {
    return {
        readOnly: true,
        autofocus: false,
        holder: 'content-html',
        tools:{
          header: Header,
          list: List,
          paragraph: Paragraph,
          table: Table,
          code: CodeTool,
          embed: Embed,
          checklist:Checklist,
          Marker:Marker,
          raw: RawTool,
          image: SimpleImage,          
        },
        /**
         * This Tool will be used as default
         */
        onReady: () => {
          this.onLoad(this.$route.params.slug, false);
        },
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
    //
  }


  async onLoad(slug: string, published: boolean) {
    try{
      const data = await $editor.load(slug,published);
      if(!data || !data.content) {
        return;
      }
      this.editor.blocks.render({blocks:data.content.fr});
    }catch(err) {
      console.log('--- DISPLAY error',err);
    }
  }

  onSave() {
    //
  }
}
</script>
