<script lang="ts" setup></script>

<template>
  <nav class="navbar">
    <a class="home" href="/">TEKTURE</a>
    <ul class="nav-links">
      <li class="nav-link menu-item">Works</li>
      <li class="nav-link menu-item">About</li>
      <li class="nav-link menu-item">Contact</li>
    </ul>
  </nav>
</template>

<style lang="scss">
.navbar {
  position: fixed;
  top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100vw - 60px);
  left: 50%;
  transform: translateX(-50%);

  > .home {
    font-size: 18px;
    font-weight: 800;
  }
  > .nav-links {
    display: flex;
    > .nav-link {
      margin-left: 32px;
    }
  }
}
</style>
