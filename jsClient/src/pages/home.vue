<template>
  <div class="hello">
    <div class="carousel-wrap">
      <v-carousel hide-controls>
        <v-carousel-item v-for="(item,i) in items" :src="item.src" :key="i"></v-carousel-item>
      </v-carousel>
    </div>

    <v-container fluid class="pa-0">
      <v-layout row wrap>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">一二三四</v-btn>
        </v-flex>
        <v-flex xs3>
          <v-btn color="info">Info</v-btn>
        </v-flex>
      </v-layout>
    </v-container>


    <v-list two-line>
      <template v-for="(item, index) in items2">
        <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
        <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>
        <v-list-tile v-else :key="item.title" avatar @click="goChapterList(item.code)">
          <v-list-tile-avatar>
            <img :src="'./static/images/novel/'+ item.code+'.jpg'">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.intro"></v-list-tile-sub-title>
          </v-list-tile-content>
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
        items2: [
          { header: 'Today' },
          { avatar: '/static/images/6212.jpg',
            title: 'Brunch this weekend?',
            subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?" },
          { divider: true, inset: true },
          { avatar: '/static/images/13589.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend." },
          { divider: true, inset: true },
          { avatar: '/static/images/17757.jpg', title: 'Oui oui', subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?" }
        ],
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
      goChapterList(code) {
        this.$router.push({
          name: 'chapterList',
          params: {code: code}
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .carousel{
    height: 298px;
  }
</style>
