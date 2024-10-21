import {within, userEvent} from '@storybook/test';
import {ref, inject} from 'vue';
import SideModal from './SideModal.vue';
import {useModal} from '@/composables/useModal.js';
import {useSideMenu} from '@/composables/useSideMenu.js';
import SideMenu from '../SideMenu/SideMenu.vue';
import SideModalBody from './SideModalBody.vue';
import SideModalLayoutBasic from './SideModalLayoutBasic.vue';
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

const SideModalBase = {
	components: {SideModalBody, SideModalLayoutBasic},
	template: `
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

			<SideModalLayoutBasic>CONTENT</SideModalLayoutBasic>
		</SideModalBody>
	`,
};

export const Base = {
	render: (args) => ({
		components: {SideModal, SideModalBase},
		setup() {
			const {openSideModal} = useModal();
			function openModal() {
				openSideModal(SideModalBase, {});
			}
			return {openModal};
		},
		template: `
			<PkpButton  @click="openModal">
				Open Modal
			</PkpButton>
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

const SideModalTwoColumns = {
	components: {SideModal, SideModalBody, SideModalLayout2Columns},
	setup() {
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
		return {metadata, generalInformation};
	},
	template: `
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
	`,
};

export const TwoColumnsLayout = {
	render: (args) => ({
		components: {SideModalTwoColumns},
		setup() {
			const {openSideModal} = useModal();

			function openModal() {
				openSideModal(SideModalTwoColumns);
			}

			return {openModal};
		},
		template: `
			<PkpButton  @click="openModal">
				Open Modal
			</PkpButton>
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

const SideModalWithForm = {
	components: {SideModalBody, PkpForm},
	setup() {
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

		const closeModal = inject('closeModal');

		function closeSideModal() {
			closeModal();
		}

		return {form, closeSideModal};
	},
	template: `
		<SideModalBody>
			<template #title>
				Title
			</template>
			<template #description>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
			</template>
			<div class="p-4">
				<div class="bg-secondary">
					<PkpForm v-bind="form" @set="setForm" @success="formSuccess" @cancel="closeSideModal" />
				</div> 
			</div>
		</SideModalBody>

	`,
};

export const WithForm = {
	render: (args) => ({
		components: {},
		setup() {
			const {openSideModal} = useModal();
			function openModal() {
				openSideModal(SideModalWithForm);
			}

			return {openModal};
		},
		template: `
			<PkpButton @click="openModal">
				Modal with Form
			</PkpButton>
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

const SideModalWithTabs = {
	components: {SideModalBody, Tab, Tabs},
	setup() {},
	template: `
		<SideModalBody>
			<template #title>
				Title
			</template>
			<template #description>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
			</template>
			<template #default="{closeModal}">
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
						<PkpButton class="mt-4" @click="closeModal()">Close</PkpButton>
					</div>		
					</div> 
				</div>
</template>
		</SideModalBody>
	`,
};

export const WithTabs = {
	render: (args) => ({
		components: {},
		setup() {
			const {openSideModal} = useModal();
			function openModal() {
				openSideModal(SideModalWithTabs);
			}
			return {openModal};
		},
		template: `
			<PkpButton  @click="openModal">
				Modal with Tabs
			</PkpButton>
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

const SideModalNested2 = {
	components: {SideModalBody},
	template: `
		<SideModalBody>
			<template #title>Second Level Side Modal</template>
			<div class="p-4">
				<div class="p-4 bg-secondary">
					Content
				</div>
			</div>
		</SideModalBody>

	`,
};

const SideModalNested1 = {
	components: {SideModalBody, SideModalNested2},

	setup() {
		const {openSideModal} = useModal();
		function openModal() {
			openSideModal(SideModalNested2);
		}
		return {openModal};
	},
	template: `
		<SideModalBody>
			<template #title>First Level Side Modal</template>
			<div class="p-4">
				<div class="p-4 bg-secondary">
					<PkpButton @click="openModal">Open Second Modal</PkpButton>
				</div>
			</div>
		</SideModalBody>

	`,
};

export const NestedModal = {
	render: (args) => ({
		components: {SideModalNested1},
		setup() {
			const {openSideModal} = useModal();

			function openModal() {
				openSideModal(SideModalNested1);
			}
			return {openModal};
		},
		template: `
			<PkpButton  @click="openModal">
				Nested modal
			</PkpButton>
	
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

		await user.click(canvas.getByText('Nested modal'));
		await user.click(await canvas.findByText('Open Second Modal'));
	},
};

const SideModalWithSideMenu = {
	components: {SideModal, SideModalBody, SideModalLayout2Columns, SideMenu},
	setup() {
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

		const items = [
			{
				label: 'Workflow',
				key: 'workflow',
				icon: 'Workflow',
				items: [
					{
						label: 'Submission',
						key: 'submission',
						link: '#',
						colorStripe: 'border-stage-desk-review',
					},
					{
						label: 'Review',
						key: 'review',
						link: '#',
						items: [
							{
								label: 'Review Round 1',
								key: 'review_round_1',
								link: '#',
							},
							{
								label: 'New Review Round',
								key: 'new_review_round',
								link: '#',
							},
						],
					},
					{
						label: 'Copyediting',
						key: 'copyediting',
						link: '#',
					},
					{
						label: 'Production',
						key: 'production',
						link: '#',
					},
				],
			},
			{
				label: 'Publication',
				key: 'publication',
				icon: 'Publication',
				isOpen: true,
				items: [
					{
						label: 'Title & Abstract',
						key: 'title_and_abstract',
						link: '#',
					},
					{
						label: 'Contributors',
						key: 'contributors',
						link: '#',
					},
					{
						label: 'Metadata',
						key: 'metadata',
						link: '#',
					},
					{
						label: 'References',
						key: 'references',
						link: '#',
					},
					{
						label: 'Galleys',
						key: 'galleys',
						link: '#',
					},
					{
						label: 'Permissions & Disclosure',
						key: 'permissions_and_disclosure',
						link: '#',
					},
					{
						label: 'Issue',
						key: 'issue',
						link: '#',
					},
				],
			},
		];

		const {sideMenuProps} = useSideMenu(items, {
			activeItemKey: 'review_round_1',
			expandedKeys: {
				workflow: true,
				review: true,
				publication: true,
			},
		});

		return {metadata, generalInformation, items, sideMenuProps};
	},
	template: `
		<SideModalBody>
			<template #pre-title>970</template>
			<template #title><span class="underline">Round 1 Review submitted by you for</span></template>
			<template #description>
				Is blended e-learning as measured by an achievement test and self-assessment better than traditional classroom learning for vocational high school students?
			</template>

				<SideModalLayout2Columns>
					<template #left>
						<div class="flex">
							<div class="flex-shrink-0">
								<SideMenu v-bind="sideMenuProps"></SideMenu>
							</div>
							<p class="px-5">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
								minim veniam, quis nostrud exercitation ullamco laboris nisi ut
								aliquip ex ea commodo consequat.
							</p>
						</div>
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
	`,
};

export const WithSideMenu = {
	render: (args) => ({
		components: {SideModalWithSideMenu},
		setup() {
			const {openSideModal} = useModal();

			function openModal() {
				openSideModal(SideModalWithSideMenu);
			}

			return {openModal};
		},
		template: `
			<PkpButton  @click="openModal">
				Open Modal
			</PkpButton>
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
