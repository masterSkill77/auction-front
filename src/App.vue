<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import Footer from "./views/partials/Footer.vue";
import Header from "./views/partials/Header.vue";
import Feature from "./views/partials/Feature.vue";
</script>

<template>
  <Header />
  <section class="banner_part">
    <div class="container">
      <div class="single_banner_slider">
        <div class="row">
          <div class="col-lg-5 col-md-8">
            <div class="banner_text">
              <div class="banner_text_iner">
                <h1>Cloth $ Wood Sofa</h1>
                <p>
                  Incididunt ut labore et dolore magna aliqua quis ipsum
                  suspendisse ultrices gravida. Risus commodo viverra
                </p>
                <a href="#" class="btn_2">buy now</a>
              </div>
            </div>
          </div>
          <div class="banner_img d-none d-lg-block">
            <img src="img/banner_img.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <Feature />
  <RouterView />
  <Footer />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
