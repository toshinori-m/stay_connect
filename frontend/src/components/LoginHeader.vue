<template>
  <div>
    <div class="z-40 top-0 bg-sky-200 p-5 w-full h-41 md:h-16">
      <div class="flex justify-center">
        <div class="float-left">
          <MouseCharacter />
        </div>
        <button class="font-bold text-3xl text-blue-600 md:-mt-4" @click="redirectToOpen">stay_connect</button>
      </div>
    </div>
  </div>
</template>

<script>
import MouseCharacter from './MouseCharacter.vue'

export default {
  components: {
    MouseCharacter
  },
  methods: {
    redirectToOpen() {
      this.$router.push({name: 'OpenPage'})
    }
  }
}
</script>
