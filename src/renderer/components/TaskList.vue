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
        <td>
          {{task.destination}}
        </td>
        <td>{{task.datetime}}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { progressbar } from 'vue-strap'
export default {
  components: {
    ProgressBar: progressbar
  },
  data () {
    return {
      tasks: []
    }
  },
  async mounted () {
    this.tasks = await this.$db.find({ })
    console.log(this.tasks)
  }
}
</script>

<style>

</style>
