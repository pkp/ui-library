import {within, userEvent} from '@storybook/test';
import {ref} from 'vue';
import SideModal from './SideModal.vue';
import SideModalBody from './SideModalBody.vue';
import SideModalLayout2Columns from './SideModalLayout2Columns.vue';
import PkpForm from '@/components/Form/Form.vue';
import cloneDeep from 'clone-deep';
import FormMock from '@/components/Form/mocks/form-announcement';
import Tabs from '@/components/Tabs/Tabs.vue';
import Tab from '@/components/Tabs/Tab.vue';

import {allModes} from '../../../.storybook/modes.js';

export default {
	title: 'Components/SideModal',
	component: SideModal,
};

export const Base = {
	render: (args) => ({
		components: {SideModal, SideModalBody},
		setup() {
			const isModalOpened = ref(false);
			function closeModal() {
				isModalOpened.value = false;
			}
			return {isModalOpened, closeModal};
		},
		template: `
			<PkpButton  @click="isModalOpened = true">
				Open Modal
			</PkpButton>
			<SideModal
				:open="isModalOpened"
				@close="closeModal"
			>
				<SideModalBody>
					<template #pre-title>325</template>
					<template #title>Title</template>
					<template #description>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
					</template>
					<template #post-description>
						Additional info, check SubmissionSummaryModal.vue for good example
					</template>
					<template #actions>
						<PkpButton element="a" href="https://www.google.com">
							View submission in detail
						</PkpButton>
					</template>

					<div class="p-4">
						<div class="bg-secondary p-4">CONTENT</div>
					</div>
				</SideModalBody>
			</SideModal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 300px"><story/></div>',
		}),
	],

	args: {},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Open Modal'));
	},
};

export const TwoColumnsLayout = {
	render: (args) => ({
		components: {SideModal, SideModalBody, SideModalLayout2Columns},
		setup() {
			const isModalOpened = ref(false);
			function closeModal() {
				isModalOpened.value = false;
			}
			const metadata = [
				{name: 'Type', value: 'Article'},
				{
					name: 'Abstract',
					value:
						'Nam id quam mollis, porta dui vel, accumsan sem. Sed commodo felis tristique justo pulvinar lacinia. Etiam pulvinar tortor et dui malesuada fringilla. Nullam leo risus, luctus ut sem ut, dignissim luctus quam. Nulla vel varius urna. Cras eget odio tellus. Proin eu nisi vehicula nulla laculis lobortis.',
				},
			];
			const generalInformation = [
				{name: 'Editors request', value: 'dd-mm-yyyy'},
				{
					name: 'Response due date',
					value: 'dd-mm-yyy',
				},
			];

			return {isModalOpened, closeModal, metadata, generalInformation};
		},
		template: `
			<PkpButton  @click="isModalOpened = true">
				Open Modal
			</PkpButton>
			<SideModal
				:open="isModalOpened"
				@close="closeModal"
			>
				<SideModalBody>
					<template #pre-title>970</template>
					<template #title><span class="underline">Round 1 Review submitted by you for</span></template>
					<template #description>
						Is blended e-learning as measured by an achievement test and self-assessment better than traditional classroom learning for vocational high school students?
					</template>

					<SideModalLayout2Columns>
						<template #left>
							<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
							minim veniam, quis nostrud exercitation ullamco laboris nisi ut
							aliquip ex ea commodo consequat.
							</p>
						</template>
						<template #right1>
							<div class="text-xl-bold">Article Metadata</div>
							<div v-for="item in metadata" class="mt-4">
								<div class="text-lg-bold">{{ item.name }}:</div>
								<div class="text-base-normal mt-1">{{item.value}}</div>
							</div>

						</template>
						<template #right2>
							<div class="text-xl-bold">General Inforation</div>
							<div v-for="item in generalInformation" class="mt-4">
								<div class="text-lg-bold">{{ item.name }}:</div>
								<div class="text-base-normal mt-1">{{item.value}}</div>
							</div>
						</template>


					</SideModalLayout2Columns>				
				</SideModalBody>
			</SideModal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 700px"><story/></div>',
		}),
	],

	args: {},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Open Modal'));
	},
};
export const WithForm = {
	render: (args) => ({
		components: {SideModal, SideModalBody, PkpForm},
		setup() {
			const isModalOpened = ref(false);
			function closeModal() {
				isModalOpened.value = false;
			}

			const form = ref({
				...cloneDeep(FormMock),
				action: 'https://httpbin.org',
				method: 'GET',
			});

			return {isModalOpened, closeModal, form};
		},
		template: `
			<PkpButton @click="isModalOpened = true">
				Modal with Form
			</PkpButton>
			<SideModal
				:open="isModalOpened"
				@close="closeModal"

			>
				<SideModalBody>
					<template #title>
						Title
					</template>
					<template #description>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
					</template>
					<div class="p-4">
						<div class="bg-secondary">
							<PkpForm v-bind="form" @set="setForm" @success="formSuccess" />
						</div> 
					</div>
				</SideModalBody>
			</SideModal>
		`,
	}),
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Modal with Form'));
	},

	decorators: [
		() => ({
			template: '<div style="height: 1600px"><story/></div>',
		}),
	],
	parameters: {
		chromatic: {
			modes: {
				desktop: {disable: true},
				'desktop rtl': {disable: true},
				desktopLargeHeight: allModes['desktopLargeHeight'],
				'desktopLargeHeight rtl': allModes['desktopLargeHeight rtl'],
			},
		},
	},

	args: {},
};

export const WithTabs = {
	render: (args) => ({
		components: {SideModal, SideModalBody, Tab, Tabs},
		setup() {
			const isModalOpened = ref(false);
			function closeModal() {
				isModalOpened.value = false;
			}
			return {isModalOpened, closeModal};
		},
		template: `
			<PkpButton  @click="isModalOpened = true">
				Modal with Tabs
			</PkpButton>
			<SideModal
				:open="isModalOpened"
				@close="closeModal"

			>
				<SideModalBody>
					<template #title>
						Title
					</template>
					<template #description>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
					</template>
					<div class="p-4">
						<div class="bg-secondary p-4">
						<p>
							Avoid complex interactions in modals whenever possible. Deeply nested
							tabs like this are often a sign that a single modal is trying to do too
							much. If there is more than one task that can be completed in a modal,
							it is usually better to use a different UI pattern.
						</p>
						<Tabs class="mt-4">
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
						<div class="flex justify-end">
							<PkpButton class="mt-4" @click="isModalOpened = false">Close</PkpButton>
						</div>		

						</div> 

					</div>
				</SideModalBody>
			</SideModal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 700px"><story/></div>',
		}),
	],
	args: {},
	play: async ({canvasElement}) => {
		// Assigns canvas to the component root element
		const canvas = within(canvasElement);
		const user = userEvent.setup();

		await user.click(canvas.getByText('Modal with Tabs'));
	},
};

export const NestedModal = {
	render: (args) => ({
		components: {SideModal, SideModalBody},
		setup() {
			const isModalOpened = ref(false);
			function closeModal() {
				isModalOpened.value = false;
			}

			const isModalOpened2 = ref(false);
			function closeModal2() {
				isModalOpened2.value = false;
			}

			return {isModalOpened, closeModal, isModalOpened2, closeModal2};
		},
		template: `
			<PkpButton  @click="isModalOpened = true">
				Nested modal
			</PkpButton>
			<SideModal
				:open="isModalOpened"
				@close="closeModal"

			>
				<SideModalBody>
					<template #title>First Level Side Modal</template>
					<div class="p-4">
						<div class="p-4 bg-secondary">
							<PkpButton @click="isModalOpened2 = true">Open Second Modal</PkpButton>
						</div>
					</div>
					<SideModal :open="isModalOpened2" @close="closeModal2">
						<SideModalBody>
							<template #title>Second Level Side Modal</template>
							<div class="p-4">
								<div class="p-4 bg-secondary">
									Content
								</div>
							</div>
						</SideModalBody>
					</SideModal>
				</SideModalBody>
			</SideModal>
		`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 400px"><story/></div>',
		}),
	],
	args: {},
	play: async ({canvasElement}) => {
		// Get parent element, as modals are in canvasElement sibling element
		const canvas = within(canvasElement.parentElement);
		const user = userEvent.setup();
		console.log(canvasElement);

		await user.click(canvas.getByText('Nested modal'));
		await user.click(await canvas.findByText('Open Second Modal'));
	},
};
