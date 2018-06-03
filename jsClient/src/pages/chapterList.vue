<template>
  <div class="hello">
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-toolbar color="indigo" dark>
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Inbox</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>search</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list>
            <v-list-tile v-for="(item,index) in lists" :key="item.title" avatar @click="goChapter(index)">
              <v-list-tile-content>
                <v-list-tile-title v-text="item.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
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
        lists: [],
        code:null,
      }
    },
    mounted: function () {
      const headers = new Headers({
        'Content-type': 'application/json',
      })
      let code = this.$route.params.code
      this.code = code
      let tubState = {
        code: code,
      }
      let requestMsg = {
        method: 'POST',
        headers: headers,
        // mode: 'cors',
        body: JSON.stringify(tubState),
        cache: 'default'
      }

      let url = this.$api.api + 'api/chapterList'
      let requestHead = new Request(url, requestMsg)
      let _this = this
      fetch(requestHead).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        _this.lists = data.data.list
      })
    },
    methods: {
      goChapter(index) {
        this.$router.push({
          name: 'chapter',
          params: {
            index,
            code:this.code
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
