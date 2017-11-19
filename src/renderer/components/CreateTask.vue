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
        <label>Название</label>
        <input type="text" class="form-control" v-model="name">
      </div>
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
          <option value="1">Локальный диск или устройство</option>
          <option value="2">Облако</option>
        </select>
      </div>
      <div class="form-group">
        <div v-if="medium == 1">
          <label>Выбор директории хранения</label>
          <div class="input-group">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button" @click="chooseDestination">Выбрать</button>
            </span>
            <input type="text" class="form-control" disabled v-model="destination">
          </div>
        </div>
        <div v-if="medium == 2">
          <label>Выбор облачного хранилища</label>
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
const fs = require('fs-extra')
const { dialog } = require('electron').remote
const moment = require('moment')
const hasha = require('hasha')

const periods = require('../../enums/periods.js')
const algorithms = require('../../enums/algorithms.js')

const required = [
  'algorithm',
  'period',
  'medium',
  'name'
]

export default {
  props: ['mode'],
  data () {
    return {
      name: null,
      algorithm: algorithms.full,
      period: periods.everyDay,
      medium: 1,
      device: 1,
      cloud: 1,
      files: [],
      destination: null
    }
  },
  computed: {
    isValid () {
      return required.every(r => this[r])
    },
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
    async create () {
      if (!this.isValid || !this.files.length) return

      const task = {
        name: this.name,
        files: this.files,
        algorithm: this.algorithm,
        datetime: this.datetime,
        destination: this.destination
      }
      await this.$db.insert(task)
      this.$router.back()
    },
    chooseDestination () {
      const destination = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      // Потому что dialog.showOpenDialog всегда возвращает массив.
      this.destination = destination[0]
    },
    async chooseFiles () {
      const inputFiles = dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections']
      })
      for (const f of inputFiles) {
        if (this.files.map(f => f.name).includes(f)) { continue }

        const fStats = fs.lstatSync(f)
        const texty = f + fStats.size + fStats.mtime + fStats.mode
        const hash = hasha(texty, { algorithm: 'md5' })

        const file = {
          name: f,
          stats: fStats,
          hash
        }
        if (fStats.isDirectory()) {
          file.isDir = true
        } else {
          file.isFile = true
        }

        this.files.push(file)
      }
    },
    remove () {
    }
  }
}
</script>

<style>

</style>
