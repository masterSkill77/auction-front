<template>
	<HeaderDashboard @openMenu="openMenu" />
	<div :class="{ 'left-side-bar': true, open: sidebar }">
		<div class="brand-logo">
			<router-link to="/">
				<img src="/public/img/core-img/logo.png" alt="" />
			</router-link>
			<div
				class="close-sidebar"
				@click="sidebar = false"
				data-toggle="left-sidebar-close">
				<i class="ion-close-round"></i>
			</div>
		</div>
		<Menu />
	</div>
	<div class="mobile-menu-overlay"></div>

	<div class="main-container">
		<router-view class="container-fluid" :key="$route.path" />
	</div>
</template>
<script setup>
	import { ref } from 'vue';
	import HeaderDashboard from '../../components/UI/dashboard/HeaderDashboard.vue';
	import Menu from '../../components/UI/dashboard/menu/Menu.vue';

	let sidebar = ref(false);
	const openMenu = () => {
		sidebar.value = !sidebar.value;
	};
</script>
