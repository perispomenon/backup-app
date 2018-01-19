<template>
<div class="container">
  <div class="row">
    <div class="col-xs-8 col-xs-offset-2">
      <h4>Создание точки восстановления</h4>
      <div class="form-group">
        <label>Название точки восстановления</label>
        <input class="form-control" v-model="pointName" type="text" maxlength="100">
      </div>
      <button class="btn btn-danger" @click="$router.back()">Отмена</button>
      <button class="btn btn-primary" @click="backup">Запустить</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import fs from 'fs-extra'
import { mediums } from '../../enums/mediums'
import { generateFilename } from '../functions/helpers'

export default {
  data () {
    return {
      pointName: null,
      isCloud: false
    }
  },
  computed: {
    ...mapState({
      chosenTask: state => state.tasks.chosen
    })
  },
  async mounted () {
    const task = await this.$db.tasks.findOne({ _id: this.chosenTask })
    if (Number(task.medium) === mediums.cloud) {
      this.isCloud = true
    }
  },
  methods: {
    async backup () {
      if (!this.pointName) { return }
      const task = await this.$db.tasks.findOne({ _id: this.chosenTask })
      let percentsTimer

      try {
        this.$store.commit('TASK_RUN', task._id)
        this.flash('Начато создание резервной копии', 'info', { timeout: 3000 })
        console.time('backup-operation')
        const filename = generateFilename(task, this.pointName)
        percentsTimer = setInterval(async () => {
          let sizeDesc
          task.isEncrypted ? sizeDesc = filename + '.enc' : sizeDesc = filename

          if (fs.existsSync(sizeDesc)) {
            const size = fs.statSync(sizeDesc).size / 1024 / 1024
            const multiplier = task.isCompressed ? 109 : 100
            this.$store.commit('RUNNING_TASK_SET',
              Math.round(size / task.totalSize * multiplier))
          }
        }, 300)

        await this.$store.dispatch('backup', { task, filename, pointName: this.pointName })
        console.timeEnd('backup-operation')
        this.flash('Резервная копия создана', 'success', { timeout: 3000 })
      } catch (error) {
        console.error(error)
        this.flash(error.message, 'error', { timeout: 3000 })
      } finally {
        clearInterval(percentsTimer)
        this.$store.commit('TASK_RUN', null)
      }
    }
  }
}
</script>

<style>

</style>
