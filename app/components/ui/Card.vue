<template lang="pug">
div
  span(ref='top')
  div.container(:class="{open: isOpen, closed: !isOpen}")
    v-card.overflow-visible.my-5
      v-card-item
        div.cardTitle
          div
            v-card-title
              slot(name="title") {{title}}
            v-card-subtitle
              slot(name="subtitle") {{subtitle}}
          div
            div.buttons
              slot(name="buttons")
      v-card-text
        .innerContainer(:style="innerContainerStyle")
          slot
          .toggle(v-if="collapseHeight" @click.prevent='toggle()')
            div
              a(v-if='!isOpen') {{collapseMessage}}
              a(v-else) Minder tonen
</template>

<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  collapseHeight: Number,
  collapseMessage: {
    type: String,
    default: "Meer tonen"
  }
})

const isOpen = ref(!props.collapseHeight)
const top = ref(null);

const innerContainerStyle = computed(() => {
  if (props.collapseHeight && !isOpen.value) {
    return `max-height: ${props.collapseHeight}px;`
  } else {
    return "";
  }
})

function toggle() {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) {
    top.value.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<style lang="scss" scoped>
.v-card {
  z-index: auto; // avoiding a new "stacking context" for the v-card, so that search results can overflow correctly
}

.cardTitle {
  display: flex;
  justify-content: space-between;
}

.buttons {
  text-align: center;
}

div.container {
  div.innerContainer {
    position: relative;
  }

  div.toggle {
    cursor: pointer;
    text-align: center;
    font-weight: bold;
  }

  &.closed {
    div.innerContainer {
      overflow: hidden;
      position: relative;

      div.toggle {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        background: linear-gradient(
                to top,
                rgba(255, 255, 255, 1) 10px,
                rgba(255, 255, 255, 0) 50px
        );

        div {
          position: absolute;
          bottom: 5px;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>
