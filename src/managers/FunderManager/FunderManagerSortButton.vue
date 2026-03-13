<template>
	<PkpButton @click="handleAction">{{ buttonLabel }}</PkpButton>
</template>

<script setup>
import {computed} from 'vue';
import PkpButton from '@/components/Button/Button.vue';
import {useFunderManagerStore} from './funderManagerStore';
import {useLocalize} from '@/composables/useLocalize';
const {t} = useLocalize();

const funderManagerStore = useFunderManagerStore();

const buttonLabel = computed(() =>
	funderManagerStore.sortingEnabled
		? t('grid.action.saveOrdering')
		: t('grid.action.order'),
);

function handleAction() {
	if (funderManagerStore.sortingEnabled) {
		funderManagerStore.saveSorting();
	} else {
		funderManagerStore.startSorting();
	}
}
</script>
