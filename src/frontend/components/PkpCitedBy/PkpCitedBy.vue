<template>
	<div :class="cn('root')" @click="showAll">
		<div :class="cn('openIconWrapper')">
			<PkpIcon icon="OpenNewTab" :class="cn('openIcon')" />
		</div>

		<div :class="cn('label')">
			{{ t('plugins.generic.crossref.registrationAgency.name') }}
		</div>

		<h2 :class="cn('count')">
			{{ store.total }}
		</h2>
	</div>
</template>

<script setup>
import {usePkpCitedByStore} from './usePkpCitedByStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const {t} = usePkpLocalize();

const props = defineProps({
	submissionId: {type: Number, required: true},
	styles: {type: Object, default: () => ({})},
});

const store = usePkpCitedByStore();

const {cn, nestedStyles} = usePkpStyles('PkpCitedBy', props.styles);

store.initialize(props, nestedStyles);
function showAll() {
	if (!store.citations.length) {
		return;
	}
	store.openCitedByModal();
}
</script>
