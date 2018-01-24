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
import Navigation from '@/components/Navigation'
import schedule from 'node-schedule'
import notifier from 'node-notifier'
import backup from './functions/backup'
import { generateFilename } from './functions/helpers'

export default {
  components: {
    Navigation
  },
  name: 'backup-app',
  async mounted () {
    this.$bus.on('schedule', async () => {
      await this.schedule()
    })
    await this.schedule()
  },
  methods: {
    async schedule () {
      const tasks = await this.$db.tasks.find({})
      for (const task of tasks) {
        schedule.scheduleJob(task.cron, async () => {
          notifier.notify({
            title: 'Программа резервного копирования',
            message: 'Сейчас будет произведено запланированное резервное копирование по задаче ' + task.name
          })
          try {
            const pointName = 'auto-point'
            await backup.do({ task, filename: generateFilename(task, pointName), pointName })
          } catch (error) {
            console.error(error)
            this.flash(error.message, { timeout: 3000 })
          }
        })
      }
    }
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
