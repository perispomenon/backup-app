<template>
<div class="table-responsive">
  <table class="table table-striped">
    <caption>Настроенные задачи резервного копирования</caption>
    <thead>
      <tr>
        <th></th>
        <th>Номер</th>
        <th>Номер</th>
        <th>Номер</th>
        <th>progress</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <input type="radio" name="task"/>
        </td>
        <td>text</td>
        <td>something</td>
        <td>
          <div class="progress">
            <progress-bar :now="5" label="label"></progress-bar>
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <input type="radio" name="task"/>
        </td>
        <td>1</td>
        <td>text</td>
        <td>something</td>
        <td>
          <div class="progress">
            <progress-bar :now="5" label></progress-bar>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { progressbar } from 'vue-strap'
export default {
  components: {
    ProgressBar: progressbar
  }
}
</script>

<style>

</style>
