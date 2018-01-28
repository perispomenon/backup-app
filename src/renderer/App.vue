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
import moment from 'moment'
import { generateFilename } from './functions/helpers'
import { periods } from '../enums/periods'
moment.locale('ru')

export default {
  components: {
    Navigation
  },
  name: 'backup-app',
  async mounted () {
    this.$bus.on('schedule', async () => {
      // await this.schedule()
    })
    await this.schedule()
    await this.$store.dispatch('getTaskPoints', this.chosenTask)
  },
  methods: {
    async schedule () {
      const tasks = await this.$db.tasks.find({})
      for (const task of tasks) {
        schedule.scheduleJob(task.datetime, async () => {
          notifier.notify({
            title: 'Программа резервного копирования',
            message: 'Сейчас будет произведено запланированное резервное копирование по задаче ' + task.name
          })
          try {
            const pointName = 'auto-point'
            await backup.do({ task, filename: generateFilename(task, pointName), pointName })
            let newDateTime
            switch (Number(task.period)) {
              case periods.everyDay:
                newDateTime = moment(task.datetime).add(1, 'day').format()
                break
              case periods.everyWeek:
              case periods.manually:
                newDateTime = moment(task.datetime).add(1, 'week').format()
                break
              case periods.everyMonth:
                newDateTime = moment(task.datetime).add(1, 'month').format()
                break
            }
            await this.$db.tasks.update({ _id: task._id }, { $set: {
              datetime: newDateTime
            } })
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
