<template>
<div>
  <nav class="navbar navbar-default">
    <div class="container">
      <ul class="nav navbar-nav">
        <li>
          <a @click="$router.push('create-task')" title="Создать задачу"><span class="glyphicon glyphicon-plus"></span></a>
        </li>
        <li>
          <a title="Редактировать задачу"><span class="glyphicon glyphicon-edit"></span></a>
        </li>
        <li class="divider-vertical"></li>
        <li><a title="Запустить задачу"><span class="glyphicon glyphicon-play" @click="backup"></span></a></li>
        <li class="divider-vertical"></li>
        <li>
          <a title="Удалить задачу" @click="removeTask"><span class="glyphicon glyphicon-trash"></span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li>
          <a @click="$router.push('settings')" title="Настройки"><span class="glyphicon glyphicon-cog"></span></a>
        </li>
      </ul>
    </div>
  </nav>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Settings from '@/components/Settings'
// import $ from 'jquery'

export default {
  components: {
    Settings
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all,
      chosenTask: state => state.tasks.chosen
    })
  },
  methods: {
    async backup () {
      if (!this.chosenTask) { return }
      await this.$store.dispatch('backup', this.chosenTask)
    },
    async removeTask () {
      await this.$db.remove({ _id: this.chosenTask })
      await this.$store.dispatch('getAllTasks')
    }
  }
}
</script>

<style scoped>
nav a {
  font-size: 1.9em;
}
</style>
