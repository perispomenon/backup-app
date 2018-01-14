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
import moment from 'moment'

export default {
  data () {
    return {
      pointName: null
    }
  },
  computed: {
    ...mapState({
      chosenTask: state => state.tasks.chosen
    })
  },
  mounted () {
  },
  methods: {
    async backup () {
      if (!this.pointName) { return }
      const task = await this.$db.tasks.findOne({ _id: this.chosenTask })
      let percentsTimer

      try {
        this.flash('Начато создание резервной копии', 'info', { timeout: 3000 })
        console.time('backup-operation')
        const filename = this.generateFilename(task, this.pointName)
        percentsTimer = setInterval(async () => {
          let sizeDesc
          task.isEncrypted ? sizeDesc = filename + '.enc' : sizeDesc = filename

          if (fs.existsSync(sizeDesc)) {
            const size = fs.lstatSync(sizeDesc).size / 1024 / 1024
            console.log(size / task.totalSize * 100)
            console.log(size, task.totalSize)
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
      }
    },
    generateFilename (task, pointName) {
      const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss')
      const filename = task.destination + '/' + task.name + '_' + pointName + '_' + timestamp + '.mbc'
      return filename
    }
  }
}
</script>

<style>

</style>
