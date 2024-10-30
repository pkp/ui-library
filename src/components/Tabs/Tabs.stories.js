import Tabs from './Tabs.vue';
import Tab from './Tab.vue';

export default {
	title: 'Components/Tabs',
	component: Tabs,
};

export const Default = {
	render: (args) => ({
		components: {Tabs, Tab},
		setup() {
			return {args};
		},
		template: `
			<Tabs
				v-bind="args"
			>
				<Tab id="first" label="First tab">First tab content</Tab>
				<Tab id="second" label="Second tab">Second tab content</Tab>
				<Tab id="third" label="Third tab">Third tab content</Tab>
			</Tabs>
		`,
	}),
	args: {
		label: 'Default demo of tabs component',
	},
};

export const NestedTabs = {
	render: (args) => ({
		components: {Tabs, Tab},
		setup() {
			return {args};
		},
		template: `
			<Tabs v-bind="args">
				<Tab id="first" label="First tab">
					<Tabs label="Tabs nested inside of a tab">
						<Tab id="A" label="Tab A">Tab A Content</Tab>
						<Tab id="B" label="Tab B">Tab B content</Tab>
						<Tab id="C" label="Tab C">Tab C content</Tab>
					</Tabs>
				</Tab>
				<Tab id="second" label="Second tab">Second tab content</Tab>
				<Tab id="third" label="Third tab">Third tab content</Tab>
			</Tabs>
		`,
	}),
	args: {
		label: 'Tabs that include another set of tabs',
	},
};

export const SideTabs = {
	render: (args) => ({
		components: {Tabs, Tab},
		setup() {
			return {args};
		},
		template: `
			<Tabs v-bind="args">
				<Tab id="first" label="First tab">
					<Tabs :is-side-tabs="true" label="Side tabs nested inside of a tab">
						<Tab id="a" label="Tab A">Tab A content</Tab>
						<Tab id="b" label="Tab B With the Long Name">Tab B content</Tab>
						<Tab id="c" label="Tab C">Tab C content</Tab>
					</Tabs>
				</Tab>
				<Tab id="second" label="Second tab">Second tab content</Tab>
				<Tab id="third" label="Third tab">Third tab content</Tab>
			</Tabs>
		`,
	}),
	args: {
		label: 'Demonstration of nested side tabs',
	},
};

export const WithIcon = {
	render: (args) => ({
		components: {Tabs, Tab},
		setup() {
			return {args};
		},
		template: `
			<Tabs v-bind="args">
				<Tab id="first" icon="Notifications" label="First tab">First tab content</Tab>
				<Tab id="second" label="Second tab">Second tab content</Tab>
				<Tab id="third" label="Third tab">Third tab content</Tab>
			</Tabs>
		`,
	}),
	args: {
		label: 'Demonstration of tabs with icon-only display',
	},
};

export const WithBadge = {
	render: (args) => ({
		components: {Tabs, Tab},
		setup() {
			return {args};
		},
		template: `
			<Tabs v-bind="args">
				<Tab id="first" label="First tab" badge="12">First tab content</Tab>
				<Tab id="second" label="Second tab" badge="2">Second tab content</Tab>
				<Tab id="third" label="Third tab">Third tab content</Tab>
			</Tabs>
		`,
	}),
	args: {
		label: 'Tabs with badge',
	},
};

export const WithDefaultTab = {
	render: (args) => ({
		components: {Tabs, Tab},
		setup() {
			return {args};
		},
		template: `
			<Tabs
				v-bind="args"
			>
				<Tab id="first" label="First tab">First tab content</Tab>
				<Tab id="second" label="Default tab">
					Default tab content displays first when opened
				</Tab>
				<Tab id="third" label="Third tab">Third tab content</Tab>
			</Tabs>
		`,
	}),
	args: {
		label: 'Demonstration of tabs with the middle tab opened by default',
		defaultTab: 'second',
	},
};
