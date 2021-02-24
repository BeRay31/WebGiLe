<template>
  <div :class="styling('cust-modal')">
    <div class="cust-modal__bg" @click="close">&nbsp;</div>
    <div :class="`cust-modal__content ${contentClass}${fullWidth? ' full-width':''}${mediumWidth? 'medium-width':''}`">
      <i class="el-icon-close cust-modal__close-btn" @click="close" />
      <h3 v-if="title">{{ title }}</h3>
      <div v-if="subtitle" class="subtitle">
        <div class="tip-box">
          <span class="bold">{{ subtitle.context }}</span>
          <span>{{ subtitle.text }}</span>
        </div>
      </div>
      <slot @close="close" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    state: Boolean,
    title: {
      default: '',
      type: String
    },
    contentClass: {
      default: '',
      type: String
    },
    fullWidth: {
      default: false,
      type: Boolean
    },
    mediumWidth: {
      default: false,
      type: Boolean
    },
    subtitle: {
      type: Object,
      default: null
    }
  },
  methods: {
    close() {
      this.$emit('closeModal');
    },
    styling(mainStyling) {
      const activeStyling = this.state ? 'active' : '';
      return `${mainStyling} ${activeStyling}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./transition";
$purple: #7250ec;
$color-primary: rgb(24, 144, 255);
$color-secondary: white;

::-webkit-scrollbar {
  width: 5px;
  &-track {
    border-radius: 5px;
  }
  &-thumb {
    background: #bcbcbc;
    border-radius: 10px;
    &:hover {
      background: #777777;
    }
  }
}

.cust-modal {
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2000;

  &__bg {
    height: 100%;
    width: 100%;
    background-color: rgba(black, 0.3);
    // opacity: 1;
    // transition: all 2s;
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 2rem;
    background-color: white;
    border-radius: 2rem;
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow: auto;

    &.overflow-initial {
      overflow: initial;
    }

    // transition: all 2s;
    // transition-delay: .1s;
  }

  &__close-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    font-size: 1.5rem;
    transition: all 0.2s;
    color: $purple;

    &:hover {
      color: $color-primary;
    }
  }

  h3 {
    font-size: 1.6rem;
    text-align: center;
    color: $purple;
  }

  &.active {
    display: flex;
    .cust-modal {
      &__bg {
        animation: fadeIn 0.5s ease;
      }

      &__content {
        animation: slideIn 0.3s ease;
        animation-fill-mode: both;
      }
    }
  }
}

.medium-width {
  max-width: unset !important;
  width: 60% !important;
}

.full-width {
  max-width: unset !important;
  width: 80% !important;
}

.subtitle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .tip-box {
    background-color: #e0e0e0;
    font-size: 0.875rem;
    padding: 0.5rem 0.5rem;
    border-radius: 0.25rem;
    margin-right: 0.25rem;

    .bold {
      font-weight: bold;
    }
  }
}
</style>
