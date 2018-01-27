<template>
<div>
  <nav class="navbar navbar-default">
    <div class="container">
      <ul class="nav navbar-nav">
        <li>
          <router-link :to="{ name: 'create-task' }" title="Создать задачу">
            <span class="glyphicon glyphicon-plus"></span>
          </router-link>
        </li>
        <li>
          <router-link :to="editTask" title="Редактировать задачу">
            <span class="glyphicon glyphicon-edit"></span>
          </router-link>
        </li>
        <li class="divider-vertical"></li>
        <li>
          <router-link :to="pointBackup" title="Запустить задачу">
            <span class="glyphicon glyphicon-play"></span>
          </router-link>
        </li>
        <li>
          <router-link :to="restore" title="Восстановить данные">
            <span class="glyphicon glyphicon-hourglass"></span>
          </router-link>
        </li>
        <li class="divider-vertical"></li>
        <li style="cursor: pointer">
          <a title="Удалить задачу" @click="removeTask"><span class="glyphicon glyphicon-trash"></span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li>
          <router-link :to="{ name: 'settings' }" title="Настройки">
            <span class="glyphicon glyphicon-cog"></span>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'landing-page' }" title="На главный экран">
            <span class="glyphicon glyphicon-home"></span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Settings from '@/components/Settings'

export default {
  components: {
    Settings
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all,
      chosenTask: state => state.tasks.chosen
    }),
    pointBackup () {
      if (this.chosenTask) return { name: 'point-backup' }
      else return '#'
    },
    restore () {
      if (this.chosenTask) return { name: 'restore', params: { chosenTask: this.chosenTask } }
      else return '#'
    },
    editTask () {
      if (this.chosenTask) return { name: 'edit-task', params: { chosenTask: this.chosenTask } }
      else return '#'
    }
  },
  methods: {
    async removeTask () {
      await this.$db.tasks.remove({ _id: this.chosenTask })
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
