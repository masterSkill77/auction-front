<template>
	<div class="cryptos-feature-area section-padding-100-0">
		<div class="container-fluid">
			<div class="col-12">
				<div class="row guide_home">
					<!-- Single Course Area -->
					<div class="col-12 col-sm-12 col-lg-4 hvr-bounce-out cursor-pointer">
						<div class="single-feature-area style-2 mb-100 text-center">
							<i class="icon-safebox"></i>
							<h3>{{ $t('guide.home_guide.fast_easy.title') }}</h3>
							<p>
								{{ $t('guide.home_guide.fast_easy.description') }}
							</p>
						</div>
					</div>

					<!-- Single Course Area -->
					<div class="col-12 col-sm-12 col-lg-4 hvr-bounce-out cursor-pointer">
						<div class="single-feature-area style-2 mb-100 text-center">
							<i class="icon-exchange"></i>
							<h3>{{ $t('guide.home_guide.commisions.title') }}</h3>
							<p>
								{{ $t('guide.home_guide.commisions.description') }}
							</p>
						</div>
					</div>

					<!-- Single Course Area -->
					<div class="col-12 col-sm-12 col-lg-4 hvr-bounce-out cursor-pointer">
						<div class="single-feature-area style-2 mb-100 text-center">
							<i class="icon-wallet"></i>
							<h3>{{ $t('guide.home_guide.secure.title') }}</h3>
							<p>
								{{ $t('guide.home_guide.secure.description') }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted } from 'vue';

	onMounted(() => {
		const gsap = window.gsap;
		gsap.registerPlugin(window.ScrollTrigger);
		const timeline = gsap.timeline();
		timeline.from('.guide_home', {
			x: -800,
			duration: 5,
			ease: 'back',
			yoyo: true,
			scrollTrigger: '.guide_home',
		});
	});
</script>
<style scoped>
	/* .guide_home {
		position: relative;
		left: -800px;
	} */
</style>
