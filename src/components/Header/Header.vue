<template>
	<div class="pkpHeader -pkpClearfix" :class="{'-isOneLine': isOneLine}">
		<span class="pkpHeader__title">
			<slot />
		</span>
		<div v-if="hasActions" class="pkpHeader__actions">
			<slot name="actions" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		isOneLine: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		hasActions() {
			return this.$slots.actions;
		}
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpHeader {
	padding: 1rem 2rem;
}

.pkpHeader__title {
	display: inline-block;
	margin: 0;
	padding: 0.25rem 0;
	font-size: @font-base;
	font-weight: @bold;
	line-height: 1.5em;

	.pkpSpinner {
		margin-left: 0.5rem;
	}
}

.pkpHeader__title > h1,
.pkpHeader__title > h2,
.pkpHeader__title > h3,
.pkpHeader__title > h4,
.pkpHeader__title > h5,
.pkpHeader__title > h6 {
	margin: 0;
	font-size: @font-base;
	font-weight: @bold;
	line-height: 1.5em;
}

.pkpHeader__title > legend {
	display: block;
}

.pkpHeader__actions {
	float: right;
	margin-top: -1px; // button borders

	> * {
		display: inline-block;

		&:first-child {
			margin-left: 1rem;
		}
	}

	> * + * {
		margin-left: 0.25rem;
	}
}

.pkpHeader.-isOneLine {
	display: flex;
	justify-content: space-between;
	align-items: center;

	.pkpHeader__title,
	.pkpHeader__title > * {
		margin-right: auto; // flex: align left when only one item
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.pkpHeader__actions {
		float: none;
		display: flex;
		align-items: center;
		margin-left: auto;

		> * {
			white-space: nowrap;
		}
	}
}
</style>
