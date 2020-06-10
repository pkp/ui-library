<template>
	<div class="previewButton">
		<pkp-button>Submit</pkp-button>
		<pkp-button :isPrimary="true">Primary</pkp-button>
		<pkp-button :isWarnable="true">Delete</pkp-button>
		<pkp-button>
			<icon icon="filter" :inline="true" />
			Filters
		</pkp-button>
		<pkp-button :isActive="isActive" @click="isActive = !isActive">
			Expand Details
		</pkp-button>
		<pkp-button element="a" href="https://example.org">
			Button-like Link
		</pkp-button>
		<pkp-button :isLink="true">Link-like Button</pkp-button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isActive: true
		};
	}
};
</script>

<style lang="less">
.previewButton {
	display: flex;
	flex-wrap: wrap;
	margin-top: -0.5rem;
	margin-left: -0.5rem;

	> * {
		margin-top: 0.5rem;
		margin-left: 0.5rem;
	}
}
</style>
