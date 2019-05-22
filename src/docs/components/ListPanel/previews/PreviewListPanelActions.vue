<template>
	<!-- Use the v-bind syntax to bind all props at once. -->
	<list-panel v-bind="components.example" @set="set">
		<pkp-header slot="header">
			{{ title }}
			<template slot="actions">
				<pkp-button @click="openModal" label="Add Item" />
				<pkp-button
					@click="openModal"
					:isWarnable="true"
					label="Reset Defaults"
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
					items: items
				}
			},
			title: 'List Panel with Actions'
		};
	},
	methods: {
		openModal() {
			alert('You opened this modal.');
		}
	}
};
</script>
