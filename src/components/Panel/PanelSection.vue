<template>
	<div class="panelSection">
		<div v-if="!!$slots.header" class="panelSection__header">
			<slot name="header" />
		</div>
		<div class="panelSection__content">
			<slot />
		</div>
	</div>
</template>

<script>
export default {
	name: 'PanelSection'
};
</script>

<style lang="less">
@import '../../styles/_import';

.panelSection {
	padding: 1rem;
	background: @lift;

	+ .panelSection {
		border-top: @bg-border-light;
	}
}

.panelSection__header {
	margin-bottom: 1rem;
	font-size: @font-sml;
	line-height: @line-sml;

	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin: 0;
		font-size: @font-base-larger;
		line-height: @line-base;
	}

	p {
		margin-top: 0.25rem;
	}
}

// Forms in Panel sections
.panelSection .pkpFormGroup {
	padding: 0;
}

@media (min-width: 1200px) {
	.panel--wide {
		.panelSection {
			display: flex;
			padding: 2rem;
		}

		.panelSection__header {
			width: 35%;
			min-width: 16rem;
			max-width: 30rem;
			margin-right: 2rem;
		}

		.panelSection__content {
			flex: 1;
			// Fix: panelSection__content exceeds panelSection width
			min-width: 1px;
		}
	}
}
</style>
