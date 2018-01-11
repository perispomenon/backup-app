<template>
<div class="container">
  <header>
    <h3>Восстановление данных</h3>
  </header>
  <div class="row">
    <div class="col-xs-5">
      <div class="form-group">
        <label>Точка восстановления</label>
        <select class="form-control" v-model="selectedPoint">
          <option v-for="taskPoint in taskPoints" :key="taskPoint._id" :value="taskPoint._id">
            {{ taskPoint.name }}
          </option>
        </select>
      </div>
    </div>
    <!-- TODO показывать инфу о точках восстановления -->
    <!-- <div class="col-xs-5 col-xs-offset-7" v-if="selectedPoint">
      <ul>
        <li v-for="file in taskPoints.find(tp => tp._id === selectedPoint).files" :key="file.name">
          {{ file.name }}
        </li>
      </ul>
    </div> -->
  </div>
  <div>
    <button class="btn btn-danger" @click="$router.back()">Отмена</button>
    <button class="btn btn-primary" @click="restore">Восстановить</button>
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
      await this.$store.dispatch('restore', this.selectedPoint)
    }
  }
}
</script>

<style>

</style>
