<template>
  <div class="modal" :id="modalId" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{title}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div class="modal-footer">
          <button
            v-if="confirmation"
            type="button"
            @click="$emit('confirm')"
            data-dismiss="modal"
            class="btn btn-primary"
          >{{confirmation}}</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal"  @click="$emit('onCancel')">{{cancel}}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "confirmation", "cancel", "modalId"]
};
</script>

<style lang="scss">
div.modal {
  .modal-body {
    max-height: 400px;
    overflow-y: scroll;
  }
}
</style>
