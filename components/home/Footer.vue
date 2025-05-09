<script lang="ts" setup></script>

<template>
  <footer>
    <p class="location">Prinsengracht 315 . 1016 GZ Amsterdam</p>
    <div class="contact">
      <img src="/icons/marker.svg" alt="" />
      <h4>Contact us</h4>
      <img src="/icons/marker.svg" alt="" />
    </div>
    <h2>TEKTURE</h2>
  </footer>
</template>

<style lang="scss">
footer {
  margin-top: 20vh;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  > .location {
    margin-top: 98px;
    font-size: 18px;
    font-weight: 400;
  }
  > .contact {
    display: flex;
    align-items: center;
    gap: 10px;
    > h4 {
      font-size: 22px;
    }
    > img:nth-of-type(2) {
      transform: rotate(180deg);
    }
  }
  > h2 {
    font-size: 21.5vw;
    font-weight: 800;
    line-height: 70%;
  }
}
</style>
