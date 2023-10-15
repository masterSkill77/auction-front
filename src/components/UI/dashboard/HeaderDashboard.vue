<template>
	<div class="header">
		<div class="header-left w-100">
			<div class="menu-icon dw dw-menu" @click="$emit('openMenu')"></div>
			<CurrencyArea :header="true" />
		</div>
	</div>
</template>

<script>
	import CurrencyArea from '../items/CurrencyArea.vue';
	import { storeToRefs } from 'pinia';
	import { defineComponent } from 'vue';
	import { useAuthStore } from '../../../stores/auth';

	export default defineComponent({
		setup() {
			const { me } = storeToRefs(useAuthStore());
			let settings = false;
			const showSettings = () => {
				settings = !settings;
				console.log(settings);
			};
			return {
				settings,
				me,
				showSettings,
			};
		},
		components: { CurrencyArea },
	});
</script>
