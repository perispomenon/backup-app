<template>
<div class="panel panel-default">
  <div class="panel-heading">
    <h6 class="text-center">Информация о задаче РК</h6>
  </div>
  <div class="panel-body" v-if="task">
    <label>
      Название: <span class="lighter">{{ task.name }}</span>
    </label>
    <label>
      Алгоритм: <span class="lighter">{{ algorithmName }}</span>
    </label>
    <label v-if="task.algorithm == 2 || task.algorithm == 3">
      Длина цепочки копирования: <span class="lighter">{{ task.chainLength }}</span>
    </label>
    <label>
      Периодичность: <span class="lighter">{{ periodName }}</span>
    </label>
    <label v-show="task.period == 4">
      Период: <span class="lighter">{{ task.cron }}</span>
    </label>
    <label v-if="latestPoint">
      Последняя точка восстановления: <span class="lighter">{{ latestPoint.name }}</span>
    </label>
    <label v-if="latestPoint">
      Последнее резервное копирование: <span class="lighter">{{ new Date(latestPoint.createdAt).toLocaleString('ru') }}</span>
    </label>
    <label>
      Шифрование включено: <span class="lighter">{{ isEncryptionOn }}</span>
    </label>
    <label v-if="task.isEncrypted">
      Место хранения ключа: <span class="lighter">{{ task.keyStorage }}</span>
    </label>
    <label>
      Сжатие включено: <span class="lighter">{{ isCompressionOn }}</span>
    </label>
    <label>
      Носитель: <span class="lighter">{{ mediumName }}</span>
    </label>
    <label>
      {{ Number(task.medium) === 1
        ? 'Директория хранения: '
        : 'Облако: '
      }}
      <span class="lighter">
        {{ Number(task.medium) === 1
          ? task.destination
          : cloudName
        }}
      </span>
    </label>
    <label>Список файлов и директорий:</label>
    <ul class="list-group">
      <li class="list-group-item" v-for="file in task.files" :key="file.name">
        <span :class="`glyphicon glyphicon-${file.isFile ? 'file' : 'folder-open'}`"></span>
        {{ file.name }}
      </li>
    </ul>
    <div class="form-group">
      <label>Комментарий</label>
      <textarea class="form-control" readonly rows="3" :value="task.note"></textarea>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import algorithms from '../../enums/algorithms.js'
import periods from '../../enums/periods.js'
import { getMediumName, mediums } from '../../enums/mediums.js'

export default {
  data () {
    return {}
  },
  watch: {
    async task () {
      if (this.task) {
        await this.$store.dispatch('getTaskPoints', this.task._id)
      }
    }
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all,
      chosenTask: state => state.tasks.chosen,
      points: state => state.points.taskPoints
    }),
    task () {
      if (!this.chosenTask) return null
      else return this.tasks.find(t => t._id === this.chosenTask)
    },
    algorithmName () {
      return algorithms.getAlgorithmName(this.task.algorithm)
    },
    periodName () {
      return periods.getPeriodName(this.task.period)
    },
    mediumName () {
      return getMediumName(this.task.medium)
    },
    isEncryptionOn () {
      if (!this.chosenTask) return null
      else return this.task.isEncrypted ? 'Да' : 'Нет'
    },
    isCompressionOn () {
      if (!this.chosenTask) return null
      else return this.task.isCompressed ? 'Да' : 'Нет'
    },
    latestPoint () {
      if (!this.chosenTask) return null
      else {
        const createdAts = this.points.map(p => moment(p.createdAt))
        const latestCreatedAt = moment.max(createdAts)
        const index = createdAts.indexOf(latestCreatedAt)
        return this.points[index]
      }
    },
    cloudName () {
      if (!this.chosenTask) return null
      if (Number(this.task.medium) === mediums.cloud) {
        switch (Number(this.task.cloud)) {
          case 1:
            return 'Яндекс Диск'
        }
      }
    }
  }
}
</script>

<style scoped>
.panel-body > label {
  display: block;
}

.lighter {
  font-weight: lighter;
}

.list-group-item {
  padding: 5px;
}
</style>
