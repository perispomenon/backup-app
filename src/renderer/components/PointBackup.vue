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
      try {
        await this.$store.dispatch('backup', { task, pointName: this.pointName })
        this.flash('Резервная копия создана', 'success', { timeout: 3000 })
      } catch (error) {
        this.flash(error.message, 'error', { timeout: 3000 })
      }
    }
  }
}
</script>

<style>

</style>
