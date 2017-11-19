<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-xs-6">
        <task-list></task-list>
      </div>
      <div class="col-xs-6">
        <task-info></task-info>
      </div>
    </div>
  </div>
  <status-footer></status-footer>
</div>
</template>

<script>
import TaskList from '@/components/TaskList'
import TaskInfo from '@/components/TaskInfo'
import StatusFooter from '@/components/StatusFooter'

export default {
  name: 'landing-page',
  components: {
    TaskList,
    TaskInfo,
    StatusFooter
  },
  methods: {}
}
</script>

<style>

</style>
