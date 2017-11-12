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
        <li><a title="Запустить задачу"><span class="glyphicon glyphicon-play"></span></a></li>
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
import Settings from '@/components/Settings'

export default {
  components: {
    Settings
  }
}
</script>

<style scoped>
nav a {
  font-size: 1.9em;
}
</style>
