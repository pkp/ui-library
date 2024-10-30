import {ref} from 'vue';
import Modal from './Modal.vue';
import PkpForm from '@/components/Form/Form.vue';
import cloneDeep from 'clone-deep';
import FormMock from '@/components/Form/mocks/form-announcement';
import List from '@/components/List/List.vue';
import ListItem from '@/components/List/ListItem.vue';
import {allModes} from '../../../.storybook/modes.js';

export default {
	title: 'Components/Modal',
	component: Modal,
};

export const Base = {
	render: (args) => ({
		components: {Modal},
		setup() {
			const isModalOpened = ref(true);

			return {isModalOpened};
		},
		template: `
			<PkpButton ref="simpleModalButton" @click="isModalOpened = true">
				Open Modal
			</PkpButton>
			<Modal
				:open="isModalOpened"
				close-label="Close"
				title="Simple Modal"
				@close="isModalOpened = false"
			>
				<p>This is an example of a simple modal.</p>
			</Modal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 150px"><story/></div>',
		}),
	],

	args: {},
};

export const WithForm = {
	render: (args) => ({
		components: {Modal, PkpForm},
		setup() {
			const isModalOpened = ref(true);

			const form = ref({
				...cloneDeep(FormMock),
				pages: [
					{
						id: 'default',
						submitButton: {
							label: 'Submit',
							isPrimary: true,
						},
						cancelButton: {
							label: 'Cancel',
						},
					},
				],
				action: 'https://httpbin.org',
				method: 'GET',
			});

			return {isModalOpened, form};
		},
		template: `
			<PkpButton ref="modalFormButton" @click="isModalOpened = true">
				Modal with Form
			</PkpButton>
			<Modal
				close-label="Close"
				title="Add Announcement"
				:open="isModalOpened"
				@close="isModalOpened = false"
			>
				<PkpForm v-bind="form" @set="setForm" @success="formSuccess" @cancel="isModalOpened = false" />
			</Modal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 1500px"><story/></div>',
		}),
	],
	parameters: {
		chromatic: {
			modes: {
				desktop: {disable: true},
				desktopLargeHeight: allModes['desktopLargeHeight'],
			},
		},
	},

	args: {},
};

export const WithTabs = {
	render: (args) => ({
		components: {Modal, PkpForm},
		setup() {
			const isModalOpened = ref(true);

			return {isModalOpened};
		},
		template: `
			<PkpButton ref="modalTabsButton" @click="isModalOpened = true">
				Modal with Tabs
			</PkpButton>
			<Modal
				close-label="Close"
				title="Nested Tabs Example"
				:open="isModalOpened"
				@close="isModalOpened = false"
			>
				<p>
					Avoid complex interactions in modals whenever possible. Deeply nested
					tabs like this are often a sign that a single modal is trying to do too
					much. If there is more than one task that can be completed in a modal,
					it is usually better to use a different UI pattern.
				</p>
				<Tabs>
					<Tab id="one" label="First Tab">
						<Tabs>
							<Tab id="nestedone" label="First nested">
								Lorem ipsum dolor sit amet
							</Tab>
							<Tab id="nestedtwo" label="Second nested">
								Amet sit dolor ipsum Lorem
							</Tab>
							<Tab id="nestedthree" label="Third nested">
								Dolor ipsum sit lorem amet
							</Tab>
						</Tabs>
					</Tab>
					<Tab id="two" label="Second Tab">This is the second tab.</Tab>
					<Tab id="three" label="Third Tab">This is the third tab.</Tab>
				</Tabs>
				<template #footer>
					<PkpButton @click="isModalOpened = false">Close</PkpButton>
				</template>
			</modal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 500px"><story/></div>',
		}),
	],

	args: {},
};

export const WithActions = {
	render: (args) => ({
		components: {Modal, List, ListItem},
		setup() {
			const isModalOpened = ref(true);
			const isSendingReport = ref(false);

			function sendEmailReport() {
				isSendingReport.value = true;
				// Simulate a server request
				setTimeout(() => {
					isSendingReport.value = false;
					isModalOpened.value = false;
				}, 2000);
			}

			return {isModalOpened, isSendingReport, sendEmailReport};
		},
		template: `
			<PkpButton ref="modalReportButton" @click="isModalOpened = true">
				Modal with Custom Actions
			</PkpButton>
			<Modal
				close-label="Close"
				title="Activity Report"
				:open="isModalOpened"
				@close="isModalOpened = false"
			>
				<List>
					<ListItem>
						<template #value>
							<Icon icon="Comment" class="h-3 w-3" :inline="true" />
							23
						</template>
						Emails sent today
					</ListItem>
					<ListItem>
						<template #value>
							<Icon icon="MySubmissions" class="h-4 w-4" :inline="true" />
							9
						</template>
						Submissions rejected today
					</ListItem>
				</List>
				<template #footer>
					<Spinner v-if="isSendingReport" />
					<PkpButton
						:is-disabled="isSendingReport"
						:is-primary="true"
						@click="sendEmailReport"
					>
						Send Email Report
					</PkpButton>
					<PkpButton
						:is-disabled="isSendingReport"
						@click="isModalOpened = false"
					>
						Close
					</PkpButton>
				</template>
			</Modal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 300px"><story/></div>',
		}),
	],

	args: {},
};
