<template>
  <div class="hello">
        <div v-for="item in lists">
          {{item.name}}
        </div>


  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
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
      body:JSON.stringify(tubState),
      cache: 'default'
    }

    let url = this.$api.api+'aip/post/chapter'
    let requestHead = new Request(url, requestMsg)
    let _this = this
    fetch(requestHead).then(function (resp) {
      return resp.json();
    }).then(function (data) {
      _this.lists = data.data.list
        console.log( data)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
