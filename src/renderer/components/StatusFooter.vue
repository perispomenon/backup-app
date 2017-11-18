<template>
<div>
  <footer>
    <div class="container">
      <div class="row">
        <div class="col-xs-8">
          <div class="form-group"></div>
          <textarea disabled="disabled" rows="4" v-model="statusString" class="form-control"></textarea>
        </div>
      </div>
    </div>
  </footer>
</div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    return {
      statusString: moment().format('lll').toString() + '... Приложение запущено'
    }
  }
}
</script>

<style scoped>
footer {
  border-top: 1px solid #f1f1f1;
  box-shadow: 1px 0px 3px 1px #077684;
}
</style>
