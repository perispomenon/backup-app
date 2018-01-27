<template>
<div class="container">
  <header>
    <h4 class="text-center">
      <strong v-if="!isReadOnly">Создание новой задачи резервного копирования</strong>
      <strong v-else>Редактирование задачи резервного копирования</strong>
    </h4>
  </header>
  <div class="row">
    <div class="col-xs-6">
      <h4 class="text-center">Параметры задачи</h4>
      <hr/>
      <div class="form-group">
        <label>Название</label>
        <input type="text" class="form-control" v-model="name">
      </div>
      <div class="form-group">
        <label>Алгоритм копирования:</label>
        <select v-model="algorithm" class="form-control" :disabled="isReadOnly">
          <option value="1">Полное копирование</option>
          <option value="2">Инкрементное копирование</option>
          <option value="3">Дифференциальное копирование</option>
        </select>
      </div>
      <div class="form-group" v-if="algorithm == 2 || algorithm == 3">
        <label>Длина цепочки копирования</label>
        <input type="number" v-model="chainLength" class="form-control" :readonly="isReadOnly">
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
        <label>Период копирования (в формате Cron)</label>
        <input type="text" v-model="cron" class="form-control"/>
      </div>
      <div class="form-group">
        <label>Носитель</label>
        <select v-model="medium" class="form-control" :disabled="isReadOnly">
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
            <option value="1">Яндекс Диск</option>
          </select>
        </div>
      </div>
      <div class="form-group cbx">
        <input type="checkbox" v-model="isCompressed">
        <label>Сжимать резервные копии</label>
      </div>
      <template v-if="!isReadOnly">
        <div class="form-group cbx">
          <input type="checkbox" v-model="isEncrypted">
          <label>Шифровать резервные копии</label>
        </div>
        <div class="form-group" v-if="isEncrypted">
          <label>Выбор устройства для хранения ключа шифрования</label>
            <div class="input-group">
              <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="chooseKeyStorage">Выбрать</button>
              </span>
              <input type="text" class="form-control" disabled v-model="keyStorage">
          </div>
        </div>
        <div class="form-group" v-if="isEncrypted">
          <label>Пароль для генерации ключа шифрования</label>
          <input type="text" class="form-control" v-model="password">
        </div>
      </template>
      <button @click="$router.back()" class="btn btn-danger">Назад</button>
      <button v-if="isReadOnly" @click="edit" class="btn btn-primary pull-right">Сохранить задачу</button>
      <button v-else @click="create" class="btn btn-primary pull-right">Сохранить задачу</button>
    </div>
    <div class="col-xs-6">
      <h4 class="text-center">Файлы и директории для копирования</h4>
      <hr/>
      <div class="panel panel-default">
        <div class="panel-heading">
          <h5>Выбрано:
            <a title="Добавить файлы" @click="chooseFiles('file')" class="pull-right choice-items"><span class="glyphicon glyphicon-file"></span></a>
            <a title="Добавить директории" @click="chooseFiles('dir')" class="pull-right choice-items"><span class="glyphicon glyphicon-folder-open"></span></a>
            <a v-if="!isReadOnly" title="Удалить" @click="clearSelection" class="pull-right choice-items"><span class="glyphicon glyphicon-remove"></span></a>
          </h5>
        </div>
        <div class="panel-body">
          <div v-for="file in files" :key="file.name">
            <span :class="`glyphicon glyphicon-${file.isFile ? 'file' : 'folder-open'}`"></span>
            {{file.name}}
          </div>
        </div>
        <div class="panel-footer">
          <label>Общий размер: {{ selectedFilesSize.toFixed(2) }} МБ</label>
        </div>
      </div>
      <div class="form-group">
        <label>Комментарий</label>
        <textarea class="form-control" rows="3" v-model="note"></textarea>
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
const validator = require('validator')
const getSize = require('get-folder-size')
const cronParser = require('cron-parser')
const isEmpty = require('lodash/isEmpty')
const { mapState } = require('vuex')

const { periods, getCron } = require('../../enums/periods')
const { algorithms } = require('../../enums/algorithms')
const { mediums } = require('../../enums/mediums')
const encryption = require('../functions/encryption').default
moment.locale('ru')

export default {
  props: ['isReadOnly'],
  data () {
    return {
      name: null,
      algorithm: algorithms.full,
      period: periods.everyDay,
      medium: 1,
      cloud: 1,
      files: [],
      destination: null,
      cron: null,
      isEncrypted: false,
      keyStorage: null,
      isCompressed: false,
      password: null,
      chainLength: null,
      note: null
    }
  },
  computed: {
    ...mapState({
      settings: state => state.config.settings
    }),
    datetime () {
      switch (Number(this.period)) {
        case periods.everyDay:
          return moment().add(1, 'day').format('YYYY-MM-DDThh:mm')
        case periods.everyWeek:
        case periods.manually:
          return moment().add(1, 'week').format('YYYY-MM-DDThh:mm')
        case periods.everyMonth:
          return moment().add(1, 'month').format('YYYY-MM-DDThh:mm')
      }
    },
    selectedFilesSize () {
      return this.files.reduce((s, c) => s + c.stats.size / 1024 / 1024, 0)
    }
  },
  async mounted () {
    if (this.$route.params.chosenTask && this.isReadOnly) {
      const task = await this.$db.tasks.findOne({ _id: this.$route.params.chosenTask })
      Object.keys(this.$data).forEach(key => {
        this.$data[key] = task[key]
      })
    }
    await this.$store.dispatch('getSettings')
    if (this.settings) {
      this.chainLength = this.settings.chainLength
    }
  },
  methods: {
    async create () {
      try {
        this.validate()

        const task = {
          name: this.name,
          files: this.files,
          algorithm: this.algorithm,
          datetime: this.datetime,
          cron: this.period === '4' ? this.cron : getCron(this.period),
          destination: this.destination,
          period: this.period,
          medium: this.medium,
          cloud: this.cloud,
          totalSize: this.selectedFilesSize,
          isEncrypted: this.isEncrypted,
          keyStorage: this.keyStorage,
          isCompressed: this.isCompressed,
          chainLength: this.chainLength,
          note: this.note
        }
        if (task.isEncrypted) {
          const salt = await encryption.generateSalt()
          task.password = await hasha(this.password + salt).slice(0, 32)
        }
        await this.$db.tasks.insert(task)
        this.$bus.emit('schedule')
        this.$router.push({ name: 'landing-page' })
      } catch (error) {
        console.error(error)
        this.flash(error.message, 'error', { timeout: 5000 })
      }
    },
    chooseDestination () {
      const destination = dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      // Потому что dialog.showOpenDialog всегда возвращает массив.
      this.destination = destination[0]
    },
    async chooseFiles (type) {
      const dialogPropeties = ['multiSelections']
      if (type === 'file') {
        dialogPropeties.push('openFile')
      } else {
        dialogPropeties.push('openDirectory')
      }
      const inputFiles = dialog.showOpenDialog({ properties: dialogPropeties })

      for (const f of inputFiles) {
        if (this.files.map(f => f.name).includes(f)) { continue }

        const fStats = fs.lstatSync(f)
        const texty = f + fStats.size + fStats.mtime
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

      for (const f of this.files) {
        if (f.isDir) {
          getSize(f.name, (err, size) => {
            if (err) throw err
            f.stats.size = size
          })
        }
      }
    },
    clearSelection () {
      this.files = []
    },
    chooseKeyStorage () {
      this.keyStorage = dialog.showOpenDialog({ properties: ['openDirectory'] })[0]
    },
    validate () {
      if (!this.name) { throw new Error('Введите название задачи') }

      if (Number(this.period) === periods.manually) {
        if (!this.cron) { throw new Error('Введите cron периодичности задачи') }
        const cronValidation = cronParser.parseString(this.cron)
        if (!isEmpty(cronValidation.errors)) { throw new Error('Введите cron в правильном формате') }
      }

      if (this.algorithm === algorithms.incremental ||
        this.algorithm === algorithms.differential) {
        if (!this.chainLength || this.chainLength === 1) {
          throw new Error('Длина цепочки должна быть больше 1')
        }
      }

      if (Number(this.medium) === mediums.local) {
        if (!this.destination) { throw new Error('Выберите место хранения резервных копий') }
      }

      if (this.isEncrypted) {
        if (!this.keyStorage) { throw new Error('Выберите место хранения ключа шифрования') }
        if (!this.keyStorage.includes('/media/')) {
          throw new Error('Местом хранения ключа шифрования не может быть локальный диск')
        }
        if (!this.password || this.password.length < 10) {
          throw new Error('Пароль должен быть не короче 10 символов')
        }
        if (!validator.isAlphanumeric(this.password)) {
          throw new Error('Пароль должен содержать только русские и латинские буквы и цифры')
        }
      }

      if (!this.files.length) { throw new Error('Не выбраны файлы для резервирования') }
    },
    async edit () {
      try {
        this.validate()
        const $set = {
          name: this.name,
          files: this.files,
          datetime: this.datetime,
          cron: this.period === '4' ? this.cron : getCron(this.period),
          destination: this.destination,
          period: this.period,
          totalSize: this.selectedFilesSize,
          isCompressed: this.isCompressed,
          note: this.note
        }

        await this.$db.tasks.update({ _id: this.$route.params.chosenTask }, { $set })
        this.$bus.emit('schedule')
        this.$router.push({ name: 'landing-page' })
        this.flash('Задача обновлена', 'success', { timeout: 3000 })
      } catch (error) {
        console.error(error)
        this.flash(error.message, 'error', { timeout: 3000 })
      }
    }
  }
}
</script>

<style scoped>
.choice-items {
  padding-right: 15px;
}
.choice-items:first-child {
  padding-right: 0;
}
input[type="checkbox"] {
  vertical-align: middle;
  margin-top: 0;
}
</style>
