import ButtonRow from './ButtonRow.vue';
export default {
	title: 'Components/ButtonRow',
	component: ButtonRow,
};

export const Default = {
	render: (args) => ({
		components: {ButtonRow},
		setup() {
			return {args};
		},
		template: `
			<ButtonRow v-bind="args">
				<template #end>
					<PkpButton :is-link="true">
						<Icon icon="ArrowLeft" class="h-4 w-4" :inline="true" />
						Back
					</PkpButton>
				</template>
				<PkpButton>Save for Later</PkpButton>
				<PkpButton :is-primary="true">Continue</PkpButton>
			</ButtonRow>
		`,
	}),

	args: {},
};
