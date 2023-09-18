<template>
  <div>
    <div class="absolute top-44 z-30 w-full md:top-16">
      <div class="rounded-lg md:pl-10 md:ml-20">
        <h1 class="font-bold text-xl text-center py-2 pt-9 md:mt-11 md:pt-10 md:px-8 md:text-4xl md:text-left">チームレベルアップのために
        </h1>
        <div class="text-center md:px-28 md:text-left md:mt-7">
          <ul class="underline font-medium text-black-300 text-blue-600 text-1xl tracking-wide list-disclist-inside md:text-2xl">
            <li class="md:pt-4">イベント：開催・応募</li>
            <li class="py-2 md:py-5">練習試合：開催・応募</li>
            <li>チームの繋がり：開催者へ連絡出来る</li>
          </ul>
          <div class="mt-60 md:-px-16 md:text-left md:mt-20">
            <form @submit.prevent="redirectToSignup">
              <button class="signup">会員登録（無料）</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute top-96 z-10 md:top-32 md:right-0 md:mr-32">
      <img :src="require('../img/sports.jpeg')" alt="Logo" class="object-cover">
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToSignup () {
      this.$router.push({name: 'SignupPage'})
    }
  }
}
</script>
