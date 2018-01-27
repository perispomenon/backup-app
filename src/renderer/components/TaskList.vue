<template>
<div class="table-responsive">
  <table class="table">
    <caption class="text-center">Настроенные задачи резервного копирования</caption>
    <thead>
      <tr>
        <th></th>
        <th>Название</th>
        <th>Следующее копирование</th>
        <th>Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in tasks" :key="task._id">
        <td style="vertical-align: middle">
          <input type="checkbox" :value="task._id" name="task" @change="deselect" @click="chooseTask(task._id)">
        </td>
        <td style="vertical-align: middle">{{ task.name }}</td>
        <td style="vertical-align: middle">{{ new Date(task.datetime).toLocaleString('ru') }}</td>
        <td style="vertical-align: middle" class="progress-cell">
          <div class="progress" v-if="runningTask && task._id === runningTask.id">
            <progress-bar :now="runningTask.now" label type="primary"></progress-bar>
          </div>
          <template v-else>Запланирована</template>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import $ from 'jquery'
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
      tasks: state => state.tasks.all,
      chosenTask: state => state.tasks.chosen,
      runningTask: state => state.tasks.running
    })
  },
  async mounted () {
    await this.$store.dispatch('getAllTasks')
    if (this.chosenTask) {
      const cbx = $(`input[type="checkbox"][value="${this.chosenTask}"]`)
      cbx.prop('checked', true)
    }
  },
  methods: {
    deselect () {
      $('input[type="checkbox"]').on('change', function () {
        $('input[name="' + this.name + '"]').not(this).prop('checked', false)
      })
    },
    chooseTask (id) {
      const $checkbox = $(`input[type="checkbox"][value="${id}"]`)
      if ($checkbox.is(':checked')) {
        this.$store.commit('TASK_CHOOSE', id)
        this.deselect()
      } else {
        this.$store.commit('TASK_CHOOSE', null)
      }
    }
  }
}
</script>

<style scoped>
table td:nth-child(2) {
  min-width: 100px;
}
table td:first-child {
  width: 20px;
}
.progress {
  margin-bottom: 0;
}
.progress-cell {
  min-width: 150px;
}
</style>
