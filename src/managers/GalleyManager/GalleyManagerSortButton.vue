<template>
	<PkpButton @click="handleAction">{{ buttonLabel }}</PkpButton>
</template>

<script setup>
import {computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useGalleyManagerStore} from './galleyManagerStore';

import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();

const galleyManagerStore = useGalleyManagerStore();

const buttonLabel = computed(() =>
	galleyManagerStore.sortingEnabled
		? t('grid.action.saveOrdering')
		: t('grid.action.order'),
);

function handleAction() {
	if (galleyManagerStore.sortingEnabled) {
		galleyManagerStore.saveSorting();
	} else {
		galleyManagerStore.startSorting();
	}
}
</script>
