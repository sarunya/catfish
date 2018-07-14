import Vue from 'vue'
import Home from './vue-docs/Home.vue'


Vue.component('button-counter', {
  data: function () {
    return {
      msg: 0,
      count : 0
    }
  },
  methods: {
    increaseCount: function (count) {
      this.count += 1;
      this.msg = `You have clicked this button for ${this.count} times`;
    }
  },
  template: '<button v-on:click="increaseCount(count)" v-bind:title="msg">You clicked me {{ count }} times.</button>'
})

new Vue({
  el: '#app',
  render: h => h(Home)
})
