<template>
<div id="settings" class="container">
  <h3 class="text-center">Настройки приложения</h3>
  <div class="row">
    <div class="col-xs-8 col-xs-offset-2">
      <div class="form-group"><label>Количество хранимых точек восстановления</label><input type="number" min="1" step="1" class="form-control"></div>
      <div class="form-group"><label>Фильтр (файлы и директории, подходящие под этот фильтр никогда не будут копироваться)</label><input type="text" class="form-control"></div>
      <div class="form-group"><label>text</label><input type="text" class="form-control"></div>
      <div class="form-group"><label>text</label><input type="text" class="form-control"></div>
      <div class="form-group"><label>text</label><input type="text" class="form-control"></div>
      <button class="btn btn-danger" @click="$router.back()">Отмена</button>
      <button class="btn btn-primary pull-right" @click="save">Сохранить</button>
    </div>
  </div>
  
</div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    save () {
      console.log('saving settings')
    }
  }
}
</script>

<style>

</style>
