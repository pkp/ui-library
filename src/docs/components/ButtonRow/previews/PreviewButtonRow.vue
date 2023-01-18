<template>
	<button-row>
		<template slot="end">
			<pkp-button :is-link="true">
				<icon icon="long-arrow-left" :inline="true" />
				Back
			</pkp-button>
		</template>
		<pkp-button>Save for Later</pkp-button>
		<pkp-button :is-primary="true">Continue</pkp-button>
	</button-row>
</template>

<script>
import ButtonRow from '../../../../components/ButtonRow/ButtonRow.vue';

export default {
	components: {
		ButtonRow,
	},
};
</script>
