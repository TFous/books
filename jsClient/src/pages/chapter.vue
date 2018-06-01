<template>
  <div>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dark class="reader-header" v-show="isShow">
            <v-btn icon @click="goBack">
              <v-icon>chevron_left</v-icon>
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
                <span>上一章</span>
                <span>下一章</span>
              </div>
            <div class="set-icon">
              <v-btn icon>
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
          <!--<v-card-text dark class="reader-foot" v-show="isShow">-->
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
          <!--</v-card-text>-->
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
        isShow:false,
        title: null,
        text: null
      }
    },
    mounted: function () {
      console.log(this.$route)
      let code = this.$route.params.code
      let index = this.$route.params.index
      const headers = new Headers({
        'Content-type': 'application/json',
      })
      let tubState = {
        code,
        index
      }
      let requestMsg = {
        method: 'POST',
        headers: headers,
        // mode: 'cors',
        body: JSON.stringify(tubState),
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
      })
    },
    methods: {
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
  .reader-foot .toolbar__content{
    display: block;
  }
</style>
