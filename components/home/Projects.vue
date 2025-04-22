<script lang="ts" setup></script>

<template>
  <section class="projects">
    <div class="project-layout">
      <div class="project-text">
        <h2>23 design</h2>
        <p>Qui fugiat qui amet excepteur occaecat in esse eiusmod officia ullamco ad aliqua ex.</p>
      </div>
      <nav class="projects-navigation">
        <div class="markers"></div>
        <ul>
          <li><h4>BNIM</h4></li>
          <li><h4>CENTRE POMPIDOU</h4></li>
          <li><h4>23 DESIGN</h4></li>
          <li><h4>ELARCH</h4></li>
          <li><h4>STUSSY STORE</h4></li>
        </ul>
      </nav>

      <div class="left-images">
        <div class="top">
          <img src="/images/1.png" alt="" />
        </div>
      </div>
      <div class="right-images">
        <div class="bottom">
          <img src="/images/2.png" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.project-layout {
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  > .project-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: center;
    max-width: 600px;
    margin-top: 72px;
  }
  > .projects-navigation {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    > ul {
      display: flex;
      flex-direction: column;
      gap: 12px;
      text-align: center;
    }
  }
  > .left-images {
    .top {
      position: absolute;
      left: 72px;
      top: 10vh;
      width: 254px;
      aspect-ratio: 254/317;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
  > .right-images {
    .bottom {
      position: absolute;
      right: 72px;
      bottom: 10vh;
      width: 394px;
      aspect-ratio: 394/277;
      > img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
