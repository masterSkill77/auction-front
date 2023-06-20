<template>
  <div class="blog-area section-padding-100" v-if="!homePage">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-12">
          <div class="cryptos-blog-posts">
            <div class="row">
              <!-- Single Blog Area -->
              <div class="col-12">
                <div class="single-blog-area blog-style-2 mb-100">
                  <!-- Thumbnail -->
                  <div class="blog-thumbnail">
                    <img
                      :src="
                        primaryNew.image_url
                          ? primaryNew.image_url
                          : 'img/blog-img/blog1.jpg'
                      "
                      alt=""
                    />
                  </div>
                  <!-- Content -->
                  <div class="blog-content">
                    <a
                      target="_blank"
                      :href="primaryNew.link"
                      class="post-title"
                      >{{ primaryNew.title }}</a
                    >
                    <div class="meta-data">
                      <a href="#">{{ primaryNew.source_id }}</a> |
                      <a href="#">{{ primaryNew.pubDate }}</a>
                    </div>
                    <p>
                      {{ primaryNew.description }}
                    </p>
                    <a
                      :href="primaryNew.link"
                      target="_blank"
                      class="btn cryptos-btn mt-50"
                      >Read More</a
                    >
                  </div>
                </div>
              </div>

              <div class="col-12">
                <div class="blog-section-heading">
                  <h3>Today’s News</h3>
                </div>
              </div>

              <div class="col-12">
                <!-- Single Blog Area -->
                <div
                  class="single-blog-area d-flex align-items-start"
                  v-for="actu in news"
                  :key="actu.id"
                >
                  <!-- Thumbnail -->
                  <div class="blog-thumbnail">
                    <img
                      :src="
                        actu.image_url
                          ? actu.image_url
                          : 'img/blog-img/blog1.jpg'
                      "
                      alt=""
                    />
                  </div>
                  <!-- Content -->
                  <div class="blog-content">
                    <a :href="actu.link" target="__blank" class="post-title">{{
                      actu.title
                    }}</a>
                    <div class="meta-data">
                      <a href="#">{{ actu.source_id }}</a> |
                      <a href="#">{{ actu.pubDate }}</a>
                    </div>
                    <p>
                      {{ actu.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Area -->
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="newsletter-area mt-100">
            <div class="section-heading text-center mx-auto">
              <h3>Subscribe to <span>Newsletter</span></h3>
              <h6>
                Cras vitae turpis lacinia, lacinia lacus non, fermentum nisi.
                Donec et sollicitudin est, in euismod erat. Ut at erat et arcu
                pulvinar cursus a eget nisl.
              </h6>
            </div>
            <form action="#" method="post">
              <input
                type="email"
                name="email"
                placeholder="Subscribe to newsletter"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-12 col-lg-7" v-else>
    <div class="blog-area">
      <!-- Single Blog Area -->
      <div
        v-for="nouvel in newsHome"
        :key="nouvel.id"
        class="single-blog-area d-flex align-items-start"
      >
        <!-- Thumbnail -->
        <div class="blog-thumbnail">
          <img
            :src="
              nouvel.image_url ? nouvel.image_url : 'img/blog-img/blog1.jpg'
            "
            alt=""
          />
        </div>
        <!-- Content -->
        <div class="blog-content">
          <a :href="nouvel.link" target="_blank" class="post-title">{{
            nouvel.title
          }}</a>
          <div class="meta-data">
            <a href="#">{{ nouvel.creator[0] }}</a> |
            <a href="#">{{ nouvel.pubDate }}</a>
          </div>
          <p>
            {{ nouvel.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/src/axios";

export default {
  props: ["homePage"],
  methods: {
    async getNews() {
      return axios
        .get(import.meta.env.VITE_APP_BACKEND_URL + "/news")
        .then((res) => res.data);
    },
  },
  computed: {
    newsHome() {
      if (this.homePage) return this.news.slice(0, 3);
    },
  },
  data() {
    return {
      news: [],
      primaryNew: {},
    };
  },
  async mounted() {
    this.news = await this.getNews();
    this.primaryNew = this.news[Math.floor(Math.random() * 10)];
  },
};
</script>
