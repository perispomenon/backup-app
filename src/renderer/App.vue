<template>
  <div id="app">
    <navigation></navigation>
    <div class="flash-wrap">
      <flash-message></flash-message>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import Navigation from '@/components/Navigation'

export default {
  components: {
    Navigation
  },
  name: 'backup-app',
  async mounted () {
    const tasks = await this.$db.tasks.find({})
    ipcRenderer.send('scheduleJobs', tasks)
  }
}
</script>

<style>
.flash-wrap {
  position: fixed;
  top: 60px;
  right: 0px;
  z-index: 155;
}
</style>
