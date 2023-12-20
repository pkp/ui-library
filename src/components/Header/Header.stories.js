import Header from './Header.vue';

export default {
	title: 'Components/Header',
	component: Header,
};

export const Default = {
	render: (args) => ({
		components: {PkpHeader: Header},
		setup() {
			return {args};
		},
		template: `
			<PkpHeader v-bind="args">
				<h1>Data Modelling and Conceptual Modelling</h1>
			</PkpHeader>
		`,
	}),
};

export const WithActions = {
	render: (args) => ({
		components: {PkpHeader: Header},
		setup() {
			return {args};
		},
		template: `
			<PkpHeader v-bind="args">
				<h3>Participants</h3>
				<template #actions>
					<PkpButton>Send Message</PkpButton>
					<PkpButton>Add Participant</PkpButton>
				</template>
			</PkpHeader>
		`,
	}),
};

export const SubmissionsExample = {
	render: (args) => ({
		components: {PkpHeader: Header},
		setup() {
			return {args};
		},
		template: `
			<PkpHeader v-bind="args">
				<h3>Submissions</h3>
				<Spinner v-if="isLoading" />
				<template #actions>
					<PkpButton :is-active="isLoading" @click="isLoading = !isLoading">
						Toggle Loading Spinner
					</PkpButton>
				</template>
			</PkpHeader>
		`,
	}),
};

export const LongHeader = {
	render: (args) => ({
		components: {PkpHeader: Header},
		setup() {
			return {args};
		},
		template: `
		<PkpHeader v-bind="args">
			<h1>
				Data Modelling and Conceptual Modelling: a comparative analysis of
				functionality and roles within both wide and narrow scopes in a context
				of rapid synergistic iterative evolution
			</h1>
			<template #actions>
				<PkpButton>Preview</PkpButton>
				<PkpButton>Activity Log</PkpButton>
			</template>
		</PkpHeader>
		`,
	}),
};

export const LongHeaderMultiLine = {
	render: (args) => ({
		components: {PkpHeader: Header},
		setup() {
			return {args};
		},
		template: `
		<PkpHeader v-bind="args">
			<h1>
				Data Modelling and Conceptual Modelling: a comparative analysis of
				functionality and roles within both wide and narrow scopes in a context
				of rapid synergistic iterative evolution
			</h1>
			<template #actions>
				<PkpButton>Preview</PkpButton>
				<PkpButton>Activity Log</PkpButton>
			</template>
		</PkpHeader>
		`,
	}),
	args: {isOneLine: false},
};
