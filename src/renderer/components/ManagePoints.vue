<template>
<div class="container">
  <header>
    <h4 class="text-center">Управление точками восстановления по задаче {{ task.name }}</h4>
  </header>
  <div>
    <div v-if="!points.length">
      Нет точек восстановления
    </div>
    <div class="table-responsive" v-else>
      <table class="table">
        <template v-for="(point, index) in points">
          <thead :key="point._id" v-if="index === 0">
            <tr>
              <th></th>
              <th></th>
              <th>Название</th>
              <th>Дата создания</th>
              <th>Размер</th>
              <th>Имя файла</th>
            </tr>
          </thead>
          <tbody :key="point._id">
            <tr>
              <td>
                <a title="Восстановить из точки восстановления" @click="restore(point._id)"><span class="glyphicon glyphicon-hourglass"></span></a>
              </td>
              <td>
                <a title="Удалить точку восстановления" @click="remove(point._id)"><span class="glyphicon glyphicon-trash"></span></a>
              </td>
              <td>{{ point.name }}</td>
              <td>{{ new Date(point.createdAt).toLocaleString('ru') }}</td>
              <td>{{ point.filesize.toFixed(2) }}</td>
              <td>
                {{ Number(task.medium) === 2
                    ? 'Файл в облаке'
                    : point.filename}}
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import fs from 'fs-extra'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      points: state => state.points.taskPoints,
      tasks: state => state.tasks.all
    }),
    task () {
      return this.tasks.find(t => t._id === this.$route.params.chosenTask)
    }
  },
  async mounted () {
    await this.$store.dispatch('getTaskPoints', this.$route.params.chosenTask)
  },
  methods: {
    async restore (pointId) {
      try {
        this.flash('Начато восстановление информации', 'info', { timeout: 3000 })
        console.time('restore-operation')
        await this.$store.dispatch('restore', pointId)
        console.timeEnd('restore-operation')
        this.flash('Информация восстановлена', 'success', { timeout: 3000 })
      } catch (error) {
        console.error(error)
        this.flash(error.message, 'error', { timeout: 3000 })
      }
    },
    async remove (pointId) {
      const point = this.points.find(p => p._id === pointId)
      const filename = this.task.isEncrypted
        ? point.filename + '.enc'
        : point.filename
      if (fs.existsSync(filename)) {
        await fs.remove(filename)
      } else {
        this.flash('Не удалось удалить резервную копию, связанную с точкой восстановления, т.к. она уже удалена или недоступна', 'info', { timeout: 3000 })
      }
      await this.$db.points.remove({ _id: pointId })
      this.flash('Точка восстановления удалена', 'info', { timeout: 3000 })
      await this.$store.dispatch('getTaskPoints', this.$route.params.chosenTask)
    }
  }
}
</script>

<style scoped>
.cbx {
  padding-bottom: 2px;
}
input[type="checkbox"] {
  vertical-align: middle;
  margin-top: 0;
}
table td a {
  font-size: 1.3em;
  cursor: pointer;
}
table td:first-child, table td:nth-child(2) {
  padding-left: 1px;
  padding-right: 1px;
}
</style>
