<template>
  <div class="hello">
      <h1>{{title}}</h1>
    <div>
      {{text}}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {
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
        body:JSON.stringify(tubState),
        cache: 'default'
      }

      let url = this.$api.api+'api/chapter'
      let requestHead = new Request(url, requestMsg)
      let _this = this
      fetch(requestHead).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        console.log(data)
        _this.title = data.data.title
        _this.text = data.data.text
      })
    },
    methods:{
      go(code){
        this.$router.push({ name: 'chapterList',
          params: { code: code }
        })
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
