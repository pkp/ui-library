<template>
	<div class="navGroup">
		<div class="navGroup__heading">
			<slot name="heading"></slot>
		</div>
		<ul class="navGroup__list">
			<slot />
		</ul>
	</div>
</template>

<script>
export default {
	props: {
		heading: String,
		links: Object,
		prefix: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="less">
@import '../styles/_import';

.navGroup__heading {
	font-size: @font-sml;
	font-weight: @bold;
	padding: 0 0.5rem;
}

.navGroup__list {
	margin: 0;
	padding: 0;
	list-style: none;
	font-size: @font-sml;

	a {
		display: block;
		padding: 0 0.5rem;
		max-width: 100%;
		text-decoration: none;
		word-wrap: break-word;
	}

	a:focus {
		outline: 0;
		box-shadow: 0 0 0 3px @primary;
		border-radius: @radius;
	}

	.router-link-exact-active {
		font-weight: @bold;
	}

	.router-link-home {
		font-weight: @normal;

		&.router-link-exact-active {
			font-weight: @bold;
		}
	}

	li {
		position: relative;
	}
}

.navGroup + .navGroup {
	margin-top: 1rem;
}
</style>
