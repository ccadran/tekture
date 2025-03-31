<script lang="ts" setup></script>

<template>
  <div class="mousemove-images">
    <img src="/images/1.png" alt="" />
    <img src="/images/2.png" alt="" />
    <img src="/images/3.png" alt="" />
    <img src="/images/4.png" alt="" />
  </div>
  <section class="hero">
    <div class="content">
      <h1>TEKTURE</h1>
      <div class="baseline">
        <p>new gen architectural studio</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.hero {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  > .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    > h1 {
      font-size: 124px;
      font-weight: 800;
    }
  }
}
.mousemove-images {
  height: 100vh;
  width: 100vw;
  position: absolute;
}
</style>
