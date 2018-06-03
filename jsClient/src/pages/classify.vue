<template>
  <div class="home">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar dark class="reader-header">
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
            <v-list two-line subheader>
              <v-list-tile v-for="(item, index) in items2" :key="index" avatar @click="">
                <v-list-tile-avatar>
                  <img :src="imgUrl + item.code+'.jpg'">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.intro"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <!--<v-list two-line>-->
              <!--<template v-for="(item, index) in items2">-->
                <!--<v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>-->
                <!--<v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>-->
                <!--<v-list-tile v-else :key="item.title" avatar @click="goChapterList(item.code)">-->
                  <!--<v-list-tile-avatar>-->
                    <!--<img :src="imgUrl + item.code+'.jpg'">-->
                  <!--</v-list-tile-avatar>-->
                  <!--<v-list-tile-content>-->
                    <!--<v-list-tile-title v-html="item.name"></v-list-tile-title>-->
                    <!--<v-list-tile-sub-title v-html="item.intro"></v-list-tile-sub-title>-->
                  <!--</v-list-tile-content>-->
                <!--</v-list-tile>-->
              <!--</template>-->
            <!--</v-list>-->
          </div>
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
        title: '',
        imgUrl: this.$api.api + '/images/',
        items2: [],
      }
    },
    mounted: function () {
      this.filterClassify()
    },
    methods: {
      goChapterList(code) {
        this.$router.push({
          name: 'chapterList',
          params: {code: code}
        })
      },
      goBack(){
        window.history.go(-1)
      },
      filterClassify(){
        const headers = new Headers({
          'Content-type': 'application/json',
        })
        let code = this.$route.params.code
        let classify = this.$api.classifys.filter(function (item) {
          return item.code == code
        })
        let data = {
          classify: classify[0].name,
        }
        this.title = classify[0].name
        let requestMsg = {
          method: 'POST',
          headers: headers,
          // mode: 'cors',
          body: JSON.stringify(data),
          cache: 'default'
        }
        let url = this.$api.api + 'api/filterClassify'
        let requestHead = new Request(url, requestMsg)
        let _this = this
        fetch(requestHead).then(function (resp) {
          return resp.json();
        }).then(function (data) {
          _this.items2 = data.data
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .home .pa-0 .btn{
    margin: 6px 3px;
  }
  .carousel{
    height: 298px;
  }
</style>
