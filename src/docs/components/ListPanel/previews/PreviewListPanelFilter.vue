<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<list-panel
		v-bind="components.example"
		@set="set"
	>
		<pkp-header slot="header">
			{{ title }}
			<template slot="actions">
				<pkp-button
					@click="toggleFilters"
					label="Filters"
					icon="filter"
					:isActive="components.example.isSidebarVisible"
				/>
			</template>
		</pkp-header>
	</list-panel>
</template>

<script>
import Container from '@/components/Container/Container.vue';
import PkpHeader from '@/components/Header/Header.vue';
import PkpButton from '@/components/Button/Button.vue';
import {props} from '../config';
import items from '../helpers/items';

export default {
	extends: Container,
	components: {
		PkpButton,
		PkpHeader
	},
	data() {
		return {
			components: {
				example: {
					...props,
					id: 'example',
					items: items,
					filters: [
						{
							heading: 'Colors',
							filters: [
								{
									param: 'color',
									title: 'Red',
									value: 'red'
								},
								{
									param: 'color',
									title: 'Green',
									value: 'green'
								},
								{
									param: 'color',
									title: 'Blue',
									value: 'blue'
								}
							]
						}
					]
				}
			},
			title: 'List Panel with Filters'
		};
	},
	methods: {
		toggleFilters() {
			this.components.example.isSidebarVisible = !this.components.example
				.isSidebarVisible;
		}
	}
};
</script>
