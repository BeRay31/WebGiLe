<template>
  <div class="home">
    <canvas 
    id="webGL"
    @click="simpleConsole"
    @dblclick="doubleConsole">

    </canvas>
  </div>
</template>

<script>


export default {
  name: "WebGLCanvas",
  data() {
    return {
      canvas: null
    }
  },
  mounted() {
    this.canvas = document.getElementById('webGL');
    console.log(this.canvas);
  },
  methods: {
    simpleConsole() {
      console.log('CLICKED');
    },
    doubleConsole() {
      console.log('dbClicked')
    }
  }
};
</script>
