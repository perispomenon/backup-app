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
          <a title="Удалить задачу"><span class="glyphicon glyphicon-remove"></span></a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li>
          <a title="Настройки" data-toggle="modal" data-target="#settings"><span class="glyphicon glyphicon-cog"></span></a>
        </li>
      </ul>
    </div>
  </nav>

  <settings></settings>
</div>
</template>

<script>
import { mapState } from 'vuex'
import Settings from '@/components/Settings'
import $ from 'jquery'

export default {
  components: {
    Settings
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all
    })
  },
  methods: {
    async backup () {
      const $checked = $('input[type="checkbox"]:checked')
      // TODO сообщения об ошибках
      if (!$checked.length) { return }
      const id = $checked.val()
      await this.$store.dispatch('backup', id)
    }
  }
}
</script>

<style scoped>
nav a {
  font-size: 1.9em;
}
</style>
