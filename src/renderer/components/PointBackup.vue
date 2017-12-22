<template>
<div class="container">
  <div class="row">
    <div class="col-xs-8 col-xs-offset-2">
      <h4>Создание точки восстановления</h4>
      <div class="form-group">
        <label>Название точки восстановления</label>
        <input class="form-control" v-model="pointName" type="text" maxlength="100">
      </div>
      <button class="btn btn-primary" @click="backup">Запустить</button>
      <button class="btn btn-danger" @click="$router.back()">Отмена</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
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
      if (!this.pointName) {
        return
      }

      const task = await this.$db.tasks.findOne({ _id: this.chosenTask })
      const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss')
      const filename = task.destination + '/' + task.name + '_' + this.pointName + '_' + timestamp + '.tgz'
      const point = {
        taskId: task._id,
        name: this.pointName,
        filename: filename
      }
      await this.$db.points.insert(point)
      await this.$store.dispatch('backup', { task, filename })
    }
  }
}
</script>

<style>

</style>
