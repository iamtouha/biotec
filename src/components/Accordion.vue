<template>
  <div class="accordion" id="accordionExample">
    <div v-for="n in Number(rows)" :key="n" class="card">
      <div class="card-header" :id="'heading'+n">
        <h2 class="mb-0">
          <button
            class="btn btn-link collapsed"
            type="button"
            data-toggle="collapse"
            :data-target="'#collapse'+n"
            :aria-controls="'#collapse'+n"
            aria-expanded="false"
          >
            <slot :name="'slotHeader'+n"></slot>
          </button>
        </h2>
      </div>

      <div
        :id="'collapse'+n"
        class="collapse"
        :aria-labelledby="'heading'+n"
        data-parent="#accordionExample"
      >
        <div class="card-body">
          <slot :name="'slot'+n"></slot>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2 class="mb-0">
          <button @click="$emit('clicked')" class="btn btn-link collapsed" type="button">
            <slot name="bttn"></slot>
          </button>
        </h2>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["rows"]
};
</script>