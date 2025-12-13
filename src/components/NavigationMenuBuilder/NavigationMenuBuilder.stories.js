import NavigationMenuBuilder from './NavigationMenuBuilder.vue';
import {ref} from 'vue';

export default {
	title: 'Components/NavigationMenuBuilder',
	component: NavigationMenuBuilder,
	tags: ['autodocs'],
	argTypes: {
		assignedItems: {control: 'object'},
		unassignedItems: {control: 'object'},
	},
};

export const Default = {
	render: (args) => ({
		components: {NavigationMenuBuilder},
		setup() {
			const assignedItems = ref([
				{id: '1', title: 'Register', children: []},
				{id: '2', title: 'Login', children: []},
				{
					id: '3',
					title: 'admin',
					isWarning: true,
					children: [
						{id: '3-1', title: 'Dashboard', taskCount: 0, children: []},
						{id: '3-2', title: 'View Profile', children: []},
					],
				},
				{id: '4', title: 'Administration', children: []},
				{id: '5', title: 'Logout', children: []},
			]);

			const unassignedItems = ref([
				{id: 'u1', title: 'Current', children: []},
				{id: 'u2', title: 'Archives', children: []},
				{id: 'u3', title: 'Announcements', children: []},
				{id: 'u4', title: 'About', children: []},
			]);

			return {assignedItems, unassignedItems};
		},
		template: `
			<div class="p-4">
				<NavigationMenuBuilder 
					v-model:assignedItems="assignedItems"
					v-model:unassignedItems="unassignedItems"
				/>
			</div>
		`,
	}),
};
