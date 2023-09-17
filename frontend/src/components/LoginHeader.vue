<template>
  <div>
    <div class="text-center z-40 fixed top-0 bg-sky-200 p-5 w-full h-41 md:h-16">
      <form @submit.prevent="redirectToOpen">
        <button class="font-bold text-3xl text-blue-600 md:-mt-1">stay_connect</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToOpen () {
      this.$router.push({name: 'OpenPage'})
    }
  }
}
</script>