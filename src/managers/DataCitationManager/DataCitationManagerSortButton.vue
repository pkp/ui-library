<template>
	<PkpButton @click="handleAction">{{ buttonLabel }}</PkpButton>
</template>

<script setup>
import {computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useDataCitationManagerStore} from './dataCitationManagerStore';
import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();

const dataCitationManagerStore = useDataCitationManagerStore();

const buttonLabel = computed(() =>
	dataCitationManagerStore.sortingEnabled
		? t('grid.action.saveOrdering')
		: t('grid.action.order'),
);

function handleAction() {
	if (dataCitationManagerStore.sortingEnabled) {
		dataCitationManagerStore.saveSorting();
	} else {
		dataCitationManagerStore.startSorting();
	}
}
</script>
