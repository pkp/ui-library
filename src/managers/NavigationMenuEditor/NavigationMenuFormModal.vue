<template>
	<SideModalBody>
		<template #title>
			{{ isEditMode ? t('common.edit') : t('grid.action.addNavigationMenu') }}
		</template>
		<SideModalLayoutBasic>
			<PkpForm v-bind="form" @cancel="closeModal" @set="set" />
		</SideModalLayoutBasic>
	</SideModalBody>
</template>

<script setup>
import {inject} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useNavigationMenuForm} from './useNavigationMenuForm';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import SideModalLayoutBasic from '@/components/Modal/SideModalLayoutBasic.vue';
import PkpForm from '@/components/Form/Form.vue';

const {t} = useLocalize();
const closeModal = inject('closeModal');

const props = defineProps({
	/**
	 * The navigation menu to edit (null for creating a new menu)
	 */
	navigationMenu: {
		type: Object,
		default: () => null,
	},
	/**
	 * The base API URL for navigation menus
	 */
	apiUrl: {
		type: String,
		required: true,
	},
	/**
	 * Legacy options from the modal handler (automatically added when opened from legacy grids)
	 */
	legacyOptions: {
		type: Object,
		default: () => null,
	},
});

const {form, set, isEditMode} = useNavigationMenuForm({
	navigationMenu: props.navigationMenu,
	apiUrl: props.apiUrl,
	legacyOptions: props.legacyOptions,
});
</script>
