<template>
  <div id="app">
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation'
import { ipcRenderer } from 'electron'

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
  /* CSS */
</style>
