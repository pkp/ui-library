<template>
	<div class="previewHeader">
		<pkp-header>
			<h1>Data Modelling and Conceptual Modelling</h1>
		</pkp-header>
		<pkp-header>
			<h3>Participants</h3>
			<template slot="actions">
				<pkp-button>Send Message</pkp-button>
				<pkp-button>Add Participant</pkp-button>
			</template>
		</pkp-header>
		<pkp-header>
			<h3>Submissions</h3>
			<spinner v-if="isLoading" />
			<template slot="actions">
				<pkp-button :isActive="isLoading" @click="isLoading = !isLoading">
					Toggle Loading Spinner
				</pkp-button>
			</template>
		</pkp-header>
		<pkp-header>
			<h1>
				Data Modelling and Conceptual Modelling: a comparative analysis of
				functionality and roles within both wide and narrow scopes in a context
				of rapid synergistic iterative evolution
			</h1>
			<template slot="actions">
				<pkp-button>Preview</pkp-button>
				<pkp-button>Activity Log</pkp-button>
			</template>
		</pkp-header>
		<pkp-header :isOneLine="false">
			<h1>
				Data Modelling and Conceptual Modelling: a comparative analysis of
				functionality and roles within both wide and narrow scopes in a context
				of rapid synergistic iterative evolution
			</h1>
			<template slot="actions">
				<pkp-button>Preview</pkp-button>
				<pkp-button>Activity Log</pkp-button>
			</template>
		</pkp-header>
	</div>
</template>

<script>
import PkpHeader from '@/components/Header/Header.vue';

export default {
	components: {
		PkpHeader
	},
	data() {
		return {
			isLoading: false
		};
	}
};
</script>

<style lang="less">
.previewHeader > {
	border-top: 1px solid #eee;

	> * {
		border: 1px solid #eee;
		border-top: none;
	}
}
</style>
