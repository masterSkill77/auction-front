<template>
	<!-- ##### Breadcumb Area Start ##### -->
	<BreadCumb route_name="Crypto Guide" />
	<!-- ##### Breadcumb Area End ##### -->

	<!-- ##### About Area Start ##### -->
	<section class="cryptos-about-area section-padding-100-0">
		<div class="container">
			<h3 class="w-100 text-center">
				{{ $t('guide.crypto_about_area.title') }} ?
			</h3>
			<div class="row align-items-center">
				<div class="col-12 col-md-4">
					<div class="about-content mb-100">
						<div class="section-heading">
							<h5>
								{{ $t('guide.crypto_about_area.description_1') }}
							</h5>
						</div>
					</div>
				</div>
				<div class="col-12 col-md-4">
					<div class="about-thumbnail mb-100">
						<img src="./img/bg-img/about.png" alt="" />
					</div>
				</div>
				<div class="col-12 col-md-4">
					<div class="about-content mb-100">
						<div class="section-heading">
							<h5>
								{{ $t('guide.crypto_about_area.description_3') }}
							</h5>
						</div>
					</div>
				</div>
				<div class="col-12 text-text w-100">
					<div class="about-content mb-100">
						<div class="w-100 text-center">
							<h5>
								{{ $t('guide.crypto_about_area.description_3') }}
							</h5>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
	<!-- ##### About Area End ##### -->

	<div
		class="cryptos-guide-line section-padding-100 bg-img bg-overlay"
		style="background-image: url(img/bg-img/bg-3.jpg)">
		<div class="container">
			<div class="row">
				<div class="col-12 col-md-6">
					<div class="section-heading white">
						<h3 class="mb-4">
							{{ $t('guide.plateforme_area.title') }}
						</h3>
						<h5 class="mb-2">{{ $t('guide.plateforme_area.description') }}</h5>
					</div>
				</div>
			</div>

			<div class="row align-items-center">
				<div class="col-12 col-md-6">
					<div class="guideline-content">
						<!-- Single Step -->
						<div class="single-step d-flex">
							<div class="quantity">01</div>
							<div class="step-content">
								<h6>{{ $t('guide.plateforme_area.action_1.title') }}</h6>
								<p>
									{{ $t('guide.plateforme_area.action_1.description') }}
								</p>
							</div>
						</div>
						<!-- Single Step -->
						<div class="single-step d-flex">
							<div class="quantity">02</div>
							<div class="step-content">
								<h6>{{ $t('guide.plateforme_area.action_2.title') }}</h6>
								<p>
									{{ $t('guide.plateforme_area.action_2.description') }}
								</p>
							</div>
						</div>
						<!-- Single Step -->
						<div class="single-step d-flex">
							<div class="quantity">03</div>
							<div class="step-content">
								<h6>{{ $t('guide.plateforme_area.action_3.title') }}</h6>
								<p>
									{{ $t('guide.plateforme_area.action_3.description') }}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div class="col-12 col-md-6">
					<div class="guideline-thumb">
						<img src="./img/bg-img/device.png" alt="" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ##### About Area Start ##### -->
	<section class="cryptos-video-area section-padding-100-0">
		<div class="container">
			<div class="row align-items-center">
				<div class="col-12 col-md-6">
					<div class="about-content mb-100">
						<div class="section-heading">
							<h3>
								<span> {{ $t('guide.about_start_area.title') }}</span>
							</h3>
							<h5>
								{{ $t('guide.about_start_area.description') }}
							</h5>
						</div>
					</div>
				</div>
				<div class="col-12 col-md-6">
					<div class="video-area mb-100">
						<img src="./img/bg-img/bg-4.jpg" alt="" />
						<div class="video-btn">
							<a
								href="https://www.youtube.com/watch?v=f5BBJ4ySgpo"
								class="videobtn"
								><img src="./img/bg-img/video-btn.png" alt=""
							/></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import BreadCumb from '@/components/UI/menu/BreadCumb.vue';
	import { useLoadingStore } from '../../stores/loading';
	useLoadingStore().setLoading(true);

	setTimeout(() => useLoadingStore().setLoading(false), 1500);
</script>
