<template>
<div class="container">
  <header>
    <h4 class="text-center"><strong>Создание новой задачи резервного копирования</strong></h4>
  </header>
  <div class="row">
    <div class="col-xs-6">
      <h4 class="text-center">Настройки</h4>
      <hr/>
      <div class="form-group">
        <label>Алгоритм копирования:</label>
        <select v-model="algorithm" class="form-control">
          <option value="1">Полное копирование</option>
          <option value="2">Инкрементное копирование</option>
          <option value="3">Дифференциальное копирование</option>
        </select>
      </div>
      <div class="form-group">
        <label>Периодичность копирования</label>
        <select v-model="period" class="form-control">
          <option value="1">Каждый день</option>
          <option value="2">Каждую неделю</option>
          <option value="3">Каждый месяц</option>
          <option value="4">Выбрать вручную</option>
        </select>
      </div>
      <div v-if="period == 4" class="form-group">
        <label>Дата следующего копирования</label>
        <input type="datetime-local" v-model="datetime" class="form-control"/>
      </div>
      <div class="form-group">
        <label>Носитель</label>
        <select v-model="medium" class="form-control">
          <option value="1">Локальный диск</option>
          <option value="2">USB устройство</option>
          <option value="3">Облако</option>
        </select>
      </div>
      <div class="form-group">
        <div v-if="medium == 1">
          <label>Выбор директории хранения</label>
        </div>
        <div v-if="medium == 2">
          <label>Выбор устройства</label>
          <select v-model="device" class="form-control">
            <option value="1">usb-device</option>
          </select>
        </div>
        <div v-if="medium == 3">
          <label v-if="medium == 3">Выбор облачного хранилища</label>
          <select v-model="cloud" class="form-control">
            <option value="1">Dropbox</option>
          </select>
        </div>
      </div>
      <button @click="$router.back()" class="btn btn-danger">Назад</button>
      <button @click="create" class="btn btn-primary pull-right">Создать задачу</button>
    </div>
    <div class="col-xs-6">
      <h4 class="text-center">Файлы и директории для копирования</h4>
      <hr/>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h5>Выбрано:<a title="Добавить" @click="chooseFiles" class="pull-right"><span class="glyphicon glyphicon-plus"></span></a><a title="Удалить" @click="remove" class="pull-right"><span class="glyphicon glyphicon-remove"></span></a></h5>
        </div>
        <div class="panel-body">
          <div v-for="file in files" :key="file.name">{{file.name}}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
const fs = require('fs')
const { dialog } = require('electron').remote
const moment = require('moment')

const periods = require('../../enums/periods.js')

export default {
  data () {
    return {
      algorithm: 1,
      period: 1,
      medium: 1,
      device: 1,
      cloud: 1,
      directory: '123',
      files: []
    }
  },
  computed: {
    datetime () {
      switch (Number(this.period)) {
        case periods.everyDay:
          return moment().add(1, 'day').format('YYYY-MM-DDThh:mm')
        case periods.everyWeek:
        case periods.manually:
          return moment().add(1, 'week').format('YYYY-MM-DDThh:mm')
        case periods.everyMonth:
          return moment().add(1, 'month').format('YYYY-MM-DDThh:mm')
        default:
          return 'crap'
      }
    }
  },
  methods: {
    create () {
      console.log(this.algorithm, this.period, this.date)
      this.$router.back()
    },
    chooseFiles () {
      const files = dialog.showOpenDialog({
        properties: ['openFile', 'openDirectory', 'multiSelections']
      })
      for (const f of files) {
        const isDir = fs.lstatSync(f).isDirectory()
        const isFile = fs.lstatSync(f).isFile()
        isDir
          ? this.files.push({ name: f, isDir, isFile: false })
          : this.files.push({ name: f, isDir: false, isFile })
      }
    },
    remove () {
    }
  }
}
</script>

<style>

</style>
