<template>
<div class="table-responsive">
  <table class="table table-striped">
    <caption>Настроенные задачи резервного копирования</caption>
    <thead>
      <tr>
        <th></th>
        <th>Название</th>
        <th>Дата следующего копирования</th>
        <th>Что-то</th>
        <th>progress</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in tasks" :key="task._id">
        <td>
          <input type="checkbox" :value="task._id">
        </td>
        <td>{{ task.name }}</td>
        <td>{{ new Date(task.datetime).toLocaleString('ru') }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { mapState } from 'vuex'
import { progressbar } from 'vue-strap'

export default {
  components: {
    ProgressBar: progressbar
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all
    })
  },
  async mounted () {
    await this.$store.dispatch('getAllTasks')
  }
}
</script>

<style>

</style>
