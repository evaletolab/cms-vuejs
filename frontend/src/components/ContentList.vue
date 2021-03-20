<template>
<!--- SOURCE -->
  <section class="sources " :class="{'open primary':open,'primary':!open}" >
    <div @click="onToggle">---</div>
    <nav class="handle" hidden></nav>
    <div class="content">
      <h3>Documents</h3>
      <ul>
        <li v-for="doc in contents" :key="doc.id">
          <router-link :to="'/content/'+doc.slug">{{doc.meta_title}} - [{{doc.meta_type}}] - v{{doc.version}}</router-link>
        </li>
        <li>
          Créer une nouvelle page
          <input v-model="slug" @keypress.enter="onCreate" placeholder="slug de la page"/>
        </li>
      </ul>

    </div>        
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import CMSIcons from '../components/CMSIcons.vue';
import { $config, $editor } from '@/services';

@Component({
  components: {
    CMSIcons    
  },
})
export default class ContentList extends Vue {

  slug = '';
  open = false;
  contents = [];


  async mounted() {
    this.contents = await $editor.get(false);
    console.log('--DBG content',this.contents)
  }


  onCreate(){
    console.log('--DNG route',this.slug)
    this.$router.push({ path: '/content/'+this.slug });
    this.open = false;
  }

  onToggle(){
    this.open = !this.open;
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  section.sources {
    color: white;
    position: fixed;
    background-color: #333;
    bottom: 0;
    left:0;
    height: calc(100vh - 100px);
    width: calc( 100vw - 10px );
    text-align: center;
    border-radius: 20px 20px 0 0;
    padding: 0 5px;    
    transform: translateY(calc(100vh - 120px));
    transition: all 200ms;
    z-index: 10;      
  }  

  section.sources.open {
    transform: translateY(180px);
  }
  section.sources svg {
    width: 55px;
    margin-top: -27px;
    height: 55px;    
    width: 67px;
    margin-top: 10px;
    height: 39px;
    transform: translateY(-27px) translateX(3px);
  }

  section.sources nav{
    width: 40px;
    height: 3px;
    background: rgba(255, 255, 255,.8);
    margin: auto;
    margin-top: 8px;
  }
  section.sources div.content{    
    font-size: 14px;
    font-weight: 200;
    text-align: left;
    padding: 5px 20px;              
    color: white!important;
  }

  section.sources div.content h3{
    text-align: center;
    text-transform: uppercase;
    font-size: 14px;
    margin-bottom: 30px;    
  }

  section.sources div.content {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin-top: -15px;
    height: 65%;
  }

  section.sources div.content  /deep/ a{
    color: white;
    font-weight: 600;
  }

  input[type="text"]{
    padding: 10px;
    font-size: 15px;
    margin: 5px;
    border-radius: 5px;
    border: 1px solid #ddd;      
  }

</style>
