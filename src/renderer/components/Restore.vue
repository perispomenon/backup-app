<template>
<div class="container">
  <header>
    <h3>Восстановление данных</h3>
  </header>
  <div class="row">
    <div class="col-xs-6">
      <div class="form-group">
        <label>Точка восстановления</label>
        <select class="form-control" v-model="selectedPoint">
          <option v-for="taskPoint of taskPoints" :key="taskPoint._id" :value="taskPoint._id">
            {{ taskPoint.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
  <div>
    <button class="btn btn-danger" @click="$router.back()">Отмена</button>
    <button class="btn btn-primary">Восстановить</button>
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
  },
  methods: {

  }
}
</script>

<style>

</style>
