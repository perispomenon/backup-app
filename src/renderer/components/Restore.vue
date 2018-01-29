<template>
<div class="container">
  <div class="row">
    <div class="col-xs-8 col-xs-offset-2">
      <header>
        <h4>Восстановление данных</h4>
      </header>
      <div class="form-group">
        <label>Точка восстановления</label>
        <select class="form-control" v-model="selectedPoint">
          <option v-for="taskPoint in taskPoints" :key="taskPoint._id" :value="taskPoint._id">
            {{ taskPoint.name }}
          </option>
        </select>
      </div>
      <button class="btn btn-danger" @click="$router.back()">Отмена</button>
      <button class="btn btn-primary" @click="restore">Восстановить</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      selectedPoint: null
    }
  },
  computed: {
    ...mapState({
      taskPoints: state => state.points.taskPoints
    })
  },
  async mounted () {
    await this.$store.dispatch('getTaskPoints', this.$route.params.chosenTask)
    this.selectedPoint = this.taskPoints[0]._id
  },
  methods: {
    async restore () {
      try {
        this.flash('Начато восстановление информации', 'info', { timeout: 3000 })
        console.time('restore-operation')
        await this.$store.dispatch('restore', this.selectedPoint)
        console.timeEnd('restore-operation')
        this.flash('Информация восстановлена', 'success', { timeout: 3000 })
      } catch (error) {
        console.error(error)
        this.flash(error.message, 'error', { timeout: 3000 })
      }
    }
  }
}
</script>

<style>

</style>
