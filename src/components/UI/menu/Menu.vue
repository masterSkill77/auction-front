<template>
  <div class="cryptos-main-menu">
    <div class="classy-nav-container breakpoint-off">
      <div class="container">
        <!-- Menu -->
        <nav class="classy-navbar justify-content-between" id="cryptosNav">
          <!-- Logo -->
          <a class="nav-brand" href="index.html"
            ><img src="img/core-img/logo.png" alt=""
          /></a>

          <!-- Navbar Toggler -->
          <div class="classy-navbar-toggler">
            <span class="navbarToggler"
              ><span></span><span></span><span></span
            ></span>
          </div>

          <!-- Menu -->
          <div class="classy-menu">
            <!-- close btn -->
            <div class="classycloseIcon">
              <div class="cross-wrap">
                <span class="top"></span><span class="bottom"></span>
              </div>
            </div>

            <!-- Nav Start -->
            <div class="classynav">
              <ul>
                <li><router-link to="/">Home</router-link></li>

                <li>
                  <a href="#">Mega Menu</a>
                  <div class="megamenu">
                    <ul class="single-mega cn-col-4">
                      <li><a href="#">- Home</a></li>
                      <li><a href="#">- About us</a></li>
                      <li><a href="#">- Services</a></li>
                      <li><a href="#">- Testimonials</a></li>
                      <li><a href="#">- News</a></li>
                      <li><a href="#">- About us</a></li>
                    </ul>
                    <ul class="single-mega cn-col-4">
                      <li><a href="#">- Contact</a></li>
                      <li><a href="#">- Faq</a></li>
                      <li><a href="#">- Terms &amp; Conditions</a></li>
                      <li><a href="#">- Careers</a></li>
                      <li><a href="#">- Newsletter &amp; Exchange</a></li>
                      <li><a href="#">- Terms &amp; Conditions</a></li>
                    </ul>
                    <ul class="single-mega cn-col-4">
                      <li><a href="#">- About us</a></li>
                      <li><a href="#">- Testimonials</a></li>
                      <li><a href="#">- Contact</a></li>
                      <li><a href="#">- Terms &amp; Conditions</a></li>
                      <li><a href="#">- Newsletter &amp; Exchange</a></li>
                      <li><a href="#">- Contact</a></li>
                    </ul>
                    <div class="single-mega cn-col-4">
                      <div class="megamenu-slides owl-carousel">
                        <img src="img/bg-img/bg-1.jpg" alt="" />
                        <img src="img/bg-img/bg-1.jpg" alt="" />
                      </div>
                    </div>
                  </div>
                </li>
                <li><a href="#">Currencies</a></li>
                <li>
                  <router-link to="/about">About</router-link>
                </li>
                <li><a href="contact.html">Contact</a></li>
              </ul>

              <!-- Newsletter Form -->
              <div class="header-newsletter-form">
                <form action="#" method="post">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Newsletter"
                  />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
            <!-- Nav End -->
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>
