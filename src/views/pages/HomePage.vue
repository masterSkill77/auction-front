<template>
	<div class="hero-slides p-0 m-0">
		<div class="container-fluid h-50">
			<div class="row h-100 align-items-center">
				<div class="col-12" style="margin: 0; padding: 0; width: 100%">
					<div
						id="carouselExampleCaptions"
						class="carousel slide"
						data-ride="carousel">
						<ol class="carousel-indicators">
							<li
								data-target="#carouselExampleCaptions"
								data-slide-to="0"
								class="active"></li>
							<li data-target="#carouselExampleCaptions" data-slide-to="1"></li>
							<li data-target="#carouselExampleCaptions" data-slide-to="2"></li>
						</ol>
						<div class="carousel-inner">
							<div class="carousel-item active">
								<div class="single-hero-slide">
									<div class="container h-100">
										<div class="row h-100 align-items-center">
											<div class="col-12 col-md-7">
												<div class="hero-slides-content">
													<h2
														data-animation="fadeInUp"
														data-delay="100ms"
														style="animation-delay: 100ms; opacity: 1"
														class="animated fadeInUp">
														<span>{{ $t('slider.slider_1.title') }}</span>
													</h2>
													<h6
														data-animation="fadeInUp"
														data-delay="400ms"
														style="animation-delay: 400ms; opacity: 1"
														class="animated fadeInUp">
														{{ $t('slider.slider_1.description') }}
													</h6>
													<a
														href="#"
														class="btn cryptos-btn animated fadeInUp"
														data-animation="fadeInUp"
														data-delay="700ms"
														style="animation-delay: 700ms; opacity: 1"
														>{{ $t('readmore') }}</a
													>
												</div>
											</div>
											<div class="col-12 col-md-5">
												<div
													class="hero-slides-thumb animated fadeInUp"
													data-animation="fadeInUp"
													data-delay="1000ms"
													style="animation-delay: 1000ms; opacity: 1">
													<img src="/public/img/bg-img/bg-2.png" alt="" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="carousel-item">
								<div class="single-hero-slide">
									<div class="container h-100">
										<div class="row h-100 align-items-center">
											<div class="col-12 col-md-7">
												<div class="hero-slides-content">
													<h2
														data-animation="fadeInUp"
														data-delay="100ms"
														style="animation-delay: 100ms; opacity: 1"
														class="animated fadeInUp">
														{{ $t('slider.slider_2.title') }}
													</h2>
													<h6
														data-animation="fadeInUp"
														data-delay="400ms"
														style="animation-delay: 400ms; opacity: 1"
														class="animated fadeInUp">
														{{ $t('slider.slider_2.description') }}
													</h6>
													<a
														href="#"
														class="btn cryptos-btn animated fadeInUp"
														data-animation="fadeInUp"
														data-delay="700ms"
														style="animation-delay: 700ms; opacity: 1"
														>{{ $t('readmore') }}</a
													>
												</div>
											</div>
											<div class="col-12 col-md-5">
												<div
													class="hero-slides-thumb animated fadeInUp"
													data-animation="fadeInUp"
													data-delay="1000ms"
													style="animation-delay: 1000ms; opacity: 1">
													<img src="/public/img/bg-img/bg-2.png" alt="" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="carousel-item">
								<div class="single-hero-slide">
									<div class="container h-100">
										<div class="row h-100 align-items-center">
											<div class="col-12 col-md-7">
												<div class="hero-slides-content">
													<h2
														data-animation="fadeInUp"
														data-delay="100ms"
														style="animation-delay: 100ms; opacity: 1"
														class="animated fadeInUp">
														<span>
															{{ $t('slider.slider_3.title') }}
														</span>
													</h2>
													<h6
														data-animation="fadeInUp"
														data-delay="400ms"
														style="animation-delay: 400ms; opacity: 1"
														class="animated fadeInUp">
														{{ $t('slider.slider_3.description') }}
													</h6>
													<a
														href="#"
														class="btn cryptos-btn animated fadeInUp"
														data-animation="fadeInUp"
														data-delay="700ms"
														style="animation-delay: 700ms; opacity: 1"
														>{{ $t('readmore') }}</a
													>
												</div>
											</div>
											<div class="col-12 col-md-5">
												<div
													class="hero-slides-thumb animated fadeInUp"
													data-animation="fadeInUp"
													data-delay="1000ms"
													style="animation-delay: 1000ms; opacity: 1">
													<img src="/public/img/bg-img/bg-2.png" alt="" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<a
							class="carousel-control-prev"
							href="#carouselExampleCaptions"
							role="button"
							data-slide="prev">
							<span
								class="carousel-control-prev-icon"
								aria-hidden="true"></span>
							<span class="sr-only">Previous</span>
						</a>
						<a
							class="carousel-control-next"
							href="#carouselExampleCaptions"
							role="button"
							data-slide="next">
							<span
								class="carousel-control-next-icon"
								aria-hidden="true"></span>
							<span class="sr-only">Next</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ##### Course Area Start ##### -->
	<Explaination />
	<!-- ##### Course Area End ##### -->
	<Millestone />

	<!-- ##### About Area Start ##### -->
	<section class="cryptos-about-area">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-12 col-md-6">
					<div class="about-thumbnail mb-100">
						<img src="/public/img/bg-img/about.png" alt="" />
					</div>
				</div>
				<div class="col-12 col-md-6">
					<div class="about-content mb-100">
						<div class="section-heading hvr-grow">
							<h3><span v-html="$t('banner.2')"></span></h3>
							<h5>
								{{ $t('banner.text-banner-2') }}
							</h5>

							<router-link to="/login" class="btn cryptos-btn mt-30">{{
								$t('readmore')
							}}</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- ##### About Area End ##### -->

	<!-- ##### Currency Area Start ##### -->
	<section
		class="currency-calculator-area section-padding-100 bg-img bg-overlay"
		style="background-image: url(img/bg-img/bg-2.jpg)">
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="section-heading text-center white mx-auto">
						<h3 class="mb-4">Cryptocurrency</h3>
						<h5 class="mb-2">
							{{ $t('banner.text-banner-4') }}
						</h5>
						<p>
							{{ $t('banner.text-banner-5') }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- ##### Currency Area End ##### -->

	<!-- ##### Blog Area Start ##### -->
	<section class="cryptos-blog-area section-padding-100">
		<div class="container-full">
			<div class="row" style="margin: 0">
				<ListNews :home-page="true" />
				<CurrencyArea />
			</div>
		</div>

		<!-- Newsletter Area -->
		<div class="container">
			<div class="row">
				<div class="col-12">
					<div class="newsletter-area mt-100">
						<div class="section-heading text-center mx-auto">
							<h3 v-html="$t('newsletter.title')"></h3>
							<h6>
								{{ $t('newsletter.text') }}
							</h6>
						</div>
						<form action="#" method="post">
							<input
								type="email"
								name="email"
								placeholder="Subscribe to newsletter" />
							<button type="submit">{{ $t('newsletter.button') }}</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script setup>
	import Explaination from '../../components/UI/items/Explaination.vue';
	import Millestone from '../../components/UI/items/Millestone.vue';
	import CurrencyArea from '../../components/UI/items/CurrencyArea.vue';
	import ListNews from '../../Model/news/ListNews.vue';
	import { useLoadingStore } from '../../stores/loading';
	import { storeToRefs } from 'pinia';
	setTimeout(() => useLoadingStore().setLoading(false), 4000);
</script>
