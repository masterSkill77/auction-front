<template>
	<div class="breadcumb-area">
		<div class="container h-100">
			<div class="row h-100 align-items-center">
				<div class="col-12 col-md-6">
					<div class="breadcumb-text">
						<h2>{{ route_name }}</h2>
					</div>
				</div>
			</div>
		</div>
		<!-- Breadcumb Thumb Area -->
		<div class="breadcumb-thumb-area">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<div class="breadcumb-thumb">
							<img src="/public/img/bg-img/breadcumb.png" alt="" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		props: ['route_name'],
	};
</script>
