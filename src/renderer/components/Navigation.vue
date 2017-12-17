<template>
<div>
  <nav class="navbar navbar-default">
    <div class="container">
      <ul class="nav navbar-nav">
        <li>
          <a @click="$router.push('create-task')" title="Создать задачу"><span class="glyphicon glyphicon-plus"></span></a>
        </li>
        <li>
          <a title="Редактировать задачу">
            <span class="glyphicon glyphicon-edit"></span>
          </a>
        </li>
        <li class="divider-vertical"></li>
        <li>
          <a title="Запустить задачу"><span class="glyphicon glyphicon-play" :data-toggle="chosenTask ? 'modal' : ''" data-target="#point-parameters"></span>
          </a>
        </li>
        <li>
          <router-link :to="{ name: 'restore', params: { chosenTask } }" title="Восстановить данные"><span class="glyphicon glyphicon-hourglass"></span></router-link>
        </li>
        <li class="divider-vertical"></li>
        <li>
          <a title="Удалить задачу" @click="removeTask"><span class="glyphicon glyphicon-trash"></span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li>
          <a @click="$router.push('settings')" title="Настройки"><span class="glyphicon glyphicon-cog"></span></a>
        </li>
        <li>
          <router-link :to="{ name: 'landing-page' }" title="На главный экран">
            <span class="glyphicon glyphicon-home"></span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
  <point-modal></point-modal>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Settings from '@/components/Settings'
import PointModal from '@/components/PointModal'

export default {
  components: {
    Settings,
    PointModal
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all,
      chosenTask: state => state.tasks.chosen
    })
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
