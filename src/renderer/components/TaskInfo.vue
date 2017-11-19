<template>
<div class="panel panel-default">
  <div class="panel-heading">
    <h6>Информация о задаче РК</h6>
  </div>
  <div class="panel-body" v-if="chosenTask">
    <label>
      Название: <span class="lighter">{{ this.task.name }}</span>
    </label>
    <label>
      Алгоритм: <span class="lighter">{{ this.algorithmName }}</span>
    </label>
    <label>
      Периодичность: <span class="lighter">{{ this.periodName }}</span>
    </label>
    <label>
      Носитель: <span class="lighter">{{ this.mediumName }}</span>
    </label>
    <label>
      {{ Number(this.task.medium) === 1
        ? 'Директория хранения: '
        : 'Облако: '
      }}
      <span class="lighter">
        {{ Number(this.task.medium) === 1
          ? this.task.destination
          : this.task.cloud
        }}
      </span>
    </label>
    <label>Список файлов и директорий:</label>
    <ul class="list-group">
      <li class="list-group-item" v-for="file in task.files" :key="file.name">{{ file.name }}</li>
    </ul>
    <div class="form-group">
      <label>Комментарий</label>
      <textarea class="form-control" readonly rows="3"></textarea>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import algorithms from '../../enums/algorithms.js'
import periods from '../../enums/periods.js'
import { getMediumName } from '../../enums/mediums.js'

export default {
  data () {
    return {}
  },
  computed: {
    ...mapState({
      tasks: state => state.tasks.all,
      chosenTask: state => state.tasks.chosen
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
    }
  },
  async mounted () {
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
