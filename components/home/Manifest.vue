<script lang="ts" setup></script>

<template>
  <section class="manifest">
    <div class="manifest-container">
      <div class="manifest-content">
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
      </div>
      <div class="manifest-content">
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
        <div class="sentence">
          <p class="inner">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni asperiores molestiae obcaecati at quasi ex!</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.manifest {
  height: 200vh;
  position: relative;
  > .manifest-container {
    height: 100vh;
    width: 100vw;
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    > .manifest-content {
      position: absolute;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
