<template>
	<pkp-header>
		Submissions
		<spinner v-if="isLoading" />
		<template slot="actions">
			<pkp-button
				label="Toggle Loading Spinner"
				:isActive="isLoading"
				@click="toggle"
			/>
		</template>
	</pkp-header>
</template>

<script>
import PkpHeader from '@/components/Header/Header.vue';
import PkpButton from '@/components/Button/Button.vue';
import Spinner from '@/components/Spinner/Spinner.vue';

export default {
	components: {
		PkpButton,
		PkpHeader,
		Spinner
	},
	data() {
		return {
			isLoading: false
		};
	},
	methods: {
		toggle() {
			this.isLoading = !this.isLoading;
		}
	}
};
</script>
