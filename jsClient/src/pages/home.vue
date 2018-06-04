<template>
  <div class="home">
    <div class="carousel-wrap">
      <v-carousel hide-controls>
        <v-carousel-item v-for="(item,i) in items" :src="item.src" :key="i"></v-carousel-item>
      </v-carousel>
    </div>

    <v-container fluid class="pa-0">
      <v-layout row wrap>
        <template v-for="item in classifys">
          <v-flex xs3>
            <v-btn color="info" @click="goClassify(item)">{{item.name}}</v-btn>
          </v-flex>
        </template>
      </v-layout>
    </v-container>

    <v-list two-line>
      <template v-for="(item, index) in items2">
        <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
        <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>
        <v-list-tile v-else :key="item.title" avatar @click="goChapter(item.code)">
          <v-list-tile-avatar class="book-img">
            <img :src="imgUrl + item.code+'.jpg'">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.intro"></v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn icon ripple>
              <v-icon color="grey lighten-1">send</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        classifys:this.$api.classifys,
        imgUrl: this.$api.imgUrl,
        items2: [],
        items: [
          {
            src: '/static/images/0.jpg'
          },
          {
            src: '/static/images/1.jpg'
          },
        ],
        routers: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' }
        ],
        right: null,
        lists: []
      }
    },
    mounted: function () {
      const headers = new Headers({
        'Content-type': 'application/json',
      })
      let tubState = {
        code: '7991',
      }
      let requestMsg = {
        method: 'POST',
        headers: headers,
        // mode: 'cors',
        body: JSON.stringify(tubState),
        cache: 'default'
      }

      let url = this.$api.api + 'api/book'
      let requestHead = new Request(url, requestMsg)
      let _this = this
      fetch(requestHead).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        _this.items2 = [{header:"小说列表"},...data.data]
      })
    },
    methods: {
      goChapter(code) {
        this.$router.push({
          name: 'chapter',
          params: {
            index:0,
            code:code
          }
        })
        // this.$router.push({
        //   name: 'chapterList',
        //   params: {code: code}
        // })
      },
      goClassify(item){
        this.$router.push({
          name: 'classify',
          params: {code: item.code}
        })
      }

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*.book-img{*/
    /*width:100px!important;*/
  /*}*/
  /*.book-img .avatar{*/
    /*border-radius: 0!important;*/
    /*width: 80px!important;*/
    /*height: 80px!important;*/
  /*}*/
  /*.book-img .avatar img{*/
    /*border-radius: 0!important;*/
  /*}*/
  .home .pa-0 .btn{
    margin: 6px 3px;
  }
  .carousel{
    height: 298px;
  }
</style>
