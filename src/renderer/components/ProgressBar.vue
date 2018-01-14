<template>
  <vue-progress-bar size="big" :val="value"></vue-progress-bar>
</template>

<script>
import VueProgressBar from 'vue-simple-progress'

export default {
  components: {
    VueProgressBar
  },
  data () {
    return {
      value: 0
    }
  },
  methods: {
    increase (newVal) {
      this.value = newVal
    }
  }
}
</script>

<style>

</style>
