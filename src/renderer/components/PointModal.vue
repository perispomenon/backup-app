<template>
<div id="point-parameters" class="modal" role="dialog">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h4>Создание точки восстановления</h4>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Название точки восстановления</label>
          <input class="form-control" v-model="pointName" type="text">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" @click="backup" data-dismiss="modal">Запустить</button>
        <button class="btn btn-danger" data-dismiss="modal">Отмена</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
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
      const point = {
        taskId: this.chosenTask,
        name: this.pointName
      }
      await this.$db.points.insert(point)
      await this.$store.dispatch('backup', this.chosenTask)
    }
  }
}
</script>

<style>

</style>
