<template>
	<div class="actionPanel">
		<div class="actionPanel__text">
			<slot />
		</div>
		<div class="actionPanel__actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<style lang="less">
@import '../../styles/_import';

.actionPanel__text {
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

.actionPanel__actions {
	.pkpButton {
		display: block;
		width: 100%;

		+ .pkpButton {
			margin-top: 0.25rem;
		}
	}
}

@media (min-width: 767px) {
	.actionPanel {
		display: grid;
		grid-template-columns: 1fr 15rem;
	}

	.actionPanel__text {
		margin-right: 1rem;

		p:last-child {
			margin-bottom: 0;
		}
	}

	.actionPanel__actions {
		justify-self: center;
		align-self: center;
		width: 100%;
	}
}
</style>
