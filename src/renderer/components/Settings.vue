<template>
<div id="settings" class="container">
  <h3 class="text-center">Настройки приложения</h3>
  <div class="row">
    <div class="col-xs-8 col-xs-offset-2">
      <div class="form-group">
        <label>Фильтр (через точку с запятой)
        </label>
        <input type="text" class="form-control" v-model="filter">
      </div>
      <button class="btn btn-danger" @click="$router.back()">Отмена</button>
      <button class="btn btn-primary pull-right" @click="save">Сохранить</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      filter: null
    }
  },
  computed: {
    ...mapState({
      settings: state => state.config.settings
    })
  },
  async mounted () {
    await this.$store.dispatch('getSettings')
    if (this.settings) {
      this.filter = this.settings.filter
    }
  },
  methods: {
    async save () {
      const newSettings = {
        filter: this.filter
      }
      await this.$store.dispatch('saveSettings', newSettings)
      this.flash('Настройки сохранены', 'success', { timeout: 3000 })
    }
  }
}
</script>
