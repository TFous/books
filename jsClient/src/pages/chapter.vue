<template>
  <div class="reader-wrap">
    <v-layout row v-show="menuShow">
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <div class="nodeloverlay" @click="toggleMenu"></div>
          <v-list class="reader-menu">
            <v-list-tile v-for="(item,index) in lists" :key="item.title" avatar @click="getChapter(index)" :class="{onFocus:index == chapterIndex}">
              <v-list-tile-content>
                <v-list-tile-title v-text="item.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <!--<v-card class="reader-menu">-->
          <!--<v-list>-->
            <!--<v-list-tile v-for="(item,index) in lists" :key="item.title" avatar @click="goChapter(index)">-->
              <!--<v-list-tile-content>-->
                <!--<v-list-tile-title v-text="item.name"></v-list-tile-title>-->
              <!--</v-list-tile-content>-->
            <!--</v-list-tile>-->
          <!--</v-list>-->
        <!--</v-card>-->

        <v-card>
          <v-toolbar dark class="reader-header" v-show="isShow">
            <v-btn icon @click="goHome">
              <v-icon>home</v-icon>
            </v-btn>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
          </v-toolbar>
          <div class="chapter-wrap">
            <h1>{{title}}</h1>
            <div id="cent-controller" @click="showController"></div>
            <div v-html="text" id="chapter-main">
            </div>
          </div>

          <v-toolbar dark class="reader-foot"  v-show="isShow">
            <!--<v-btn-->
              <!--absolute-->
              <!--dark-->
              <!--fab-->
              <!--top-->
              <!--right-->
              <!--color="pink"-->
            <!--&gt;-->
              <!--<v-icon>add</v-icon>-->
            <!--</v-btn>-->
              <div class="set-chapter">
                <span @click="preChapter">上一章</span>
                <span @click="nextChapter">下一章</span>
              </div>
            <div class="set-icon">
              <v-btn icon @click="toggleMenu">
                <v-icon>format_list_bulleted</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>text_fields</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>brightness_4</v-icon>
              </v-btn>
              <!--<v-btn icon>-->
                <!--<v-icon>brightness_7</v-icon>-->
              <!--</v-btn>-->
              <v-btn icon>
                <v-icon>settings</v-icon>
              </v-btn>
            </div>
          </v-toolbar>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        lists:[],
        menuShow:false,
        isFocus:true,
        isShow:false,
        title: null,
        chapterIndex: 0,
        bookCode: null,
        text: null,
        chapterLength:0
      }
    },
    mounted: function () {
      let code = this.$route.params.code
      let index = this.$route.params.index
      this.chapterIndex = index
      this.bookCode = code
      this.getChapter(index)
      this.getList(code)
    },
    methods: {
      preChapter(){
        let index = Number(this.chapterIndex) - 1 < 0 ?0: Number(this.chapterIndex) - 1
        this.getChapter(index.toString())
      },
      nextChapter(){
        let index = Number(this.chapterIndex) + 1 > this.chapterLength ? this.chapterLength : Number(this.chapterIndex) + 1
        this.getChapter(index.toString())
      },
      toggleMenu(){
        this.menuShow = !this.menuShow
        this.isShow = false
      },
      goto(target){
        var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
        if (scrollT >target) {
          var timer = setInterval(function(){
            var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
            var step = Math.floor(-scrollT/6);
            document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
            if(scrollT <= target){
              document.body.scrollTop = document.documentElement.scrollTop = target;
              clearTimeout(timer);
            }
          },1)
        }else if(scrollT == 0){
          var timer = setInterval(function(){
            var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
            var step = Math.floor(300/3*0.7);
            document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
            console.log(scrollT)
            if(scrollT >= target){
              document.body.scrollTop = document.documentElement.scrollTop = target;
              clearTimeout(timer);
            }
          },1)
        }else if(scrollT < target){
          var timer = setInterval(function(){
            var scrollT = document.body.scrollTop|| document.documentElement.scrollTop
            var step = Math.floor(scrollT/6);
            document.documentElement.scrollTop = document.body.scrollTop = step + scrollT;
            if(scrollT >= target){
              document.body.scrollTop = document.documentElement.scrollTop = target;
              clearTimeout(timer);
            }
          },1)
        }else if(target == scrollT){
          return false;
        }
      },
      getList(code){
        const headers = new Headers({
          'Content-type': 'application/json',
        })
        let data = {
          code
        }
        let requestMsg = {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(data),
          cache: 'default'
        }

        let url = this.$api.api + 'api/chapterList'
        let requestHead = new Request(url, requestMsg)
        let _this = this
        fetch(requestHead).then(function (resp) {
          return resp.json();
        }).then(function (data) {
          _this.lists = data.data.list
          _this.chapterLength = data.data.list.length
        })
      },
      getChapter(index){
        this.$router.push({
          name: 'chapter',
          params: {
            index:index,
            code:this.bookCode
          }
        })
        this.chapterIndex = index
        this.menuShow = false

        const headers = new Headers({
          'Content-type': 'application/json',
        })
        let data = {
          code:this.bookCode,
          index
        }
        let requestMsg = {
          method: 'POST',
          headers: headers,
          // mode: 'cors',
          body: JSON.stringify(data),
          cache: 'default'
        }

        let url = this.$api.api + 'api/chapter'
        let requestHead = new Request(url, requestMsg)
        let _this = this
        fetch(requestHead).then(function (resp) {
          return resp.json();
        }).then(function (data) {
          _this.title = data.data.name
          _this.text = data.data.content
          _this.goto(0)
        })
      },
      go(code) {
        this.$router.push({
          name: 'chapterList',
          params: {code: code}
        })
      },
      showController() {
        this.isShow = !this.isShow
      },
      goBack(){
        window.history.go(-1)
      },
      goHome(){
        location.href='/'
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .chapter-wrap {
    padding: 20px 0px;
  }

  .chapter-wrap h1 {
    margin-bottom: 12px;
    text-align: center;
    font-size: 20px;
  }

  #chapter-main {
    font-family: sans-serif;
    font-size: 1.3rem;
    line-height: 1.8;
    overflow: hidden;
    min-height: calc(100vh - 44px);
    margin: 0 16px;
    text-align: justify;
  }

  #cent-controller {
    width: 60%;
    height: 40%;
    background: transparent;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -30%;
    margin-top: -30%;
    z-index: 999;
  }
  .reader-foot{
    position: fixed;
    bottom: 0px;
    height: 120px;
  }
  .reader-header{
    position: fixed;
    top:0px;
  }
  .set-chapter{
    padding:20px;
    display: flex;
    margin-left: 0px!important;
    justify-content:space-between;
  }
  .set-icon{
    padding:0px 4px;
    display: flex;
    justify-content:space-between;
    margin: 0px!important;
  }
  .onFocus{
    color:#F48024;
  }
  .reader-foot .toolbar__content{
    display: block;
  }
  .reader-menu .list__tile__title{
    font-size: 13px;
  }
  .reader-menu .list__tile__content{
    border-top: 1px solid rgba(219, 219, 219, 0.41);
  }
  .reader-menu>div:first-child .list__tile__content{
    border-top: 0px none;
  }
  .reader-menu .list__tile--avatar{
    height: 36px;
  }
  .reader-menu{
    position: fixed;
    width:80%;
    overflow-y: auto;
    z-index: 999999;
    height:100%;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100vh;
    max-width: 100%;
  }

  .reader-wrap .nodeloverlay{
    background: #000;
    opacity: 0.5;
    width:100%;
    position: fixed;
    top:0px;
    left: 0px;
    display: flex;
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100vh;
    max-width: 100%;
    z-index: 99999;
    height:100%;
    overflow: hidden;
    pointer-events:auto ;
    touch-action: none;
  }

</style>
