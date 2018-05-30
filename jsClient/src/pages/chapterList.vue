<template>
  <div class="hello">
    <div v-for="(item,index) in lists" @click="goChapter(index)">
      {{item.name}}
    </div>
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
        console.log(data)
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
