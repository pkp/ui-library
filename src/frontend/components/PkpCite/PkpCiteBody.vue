<template>
	<div :class="cn('root')">
		<div :class="cn('styleSelector')">
			<label :id="labelId" :class="cn('label')">
				{{ t('submission.howToCite.citationFormats') }}
			</label>
			<PkpCombobox
				:items="store.comboboxItems"
				:placeholder="t('submission.howToCite.citationFormats')"
				:aria-labelledby="labelId"
				@select="handleStyleSelect"
			/>
		</div>

		<div :class="cn('outputWrapper')">
			<div
				:class="[
					cn('output'),
					store.isLoading ? cn('output', {modifier: 'loading'}) : '',
				]"
				aria-live="polite"
			>
				<div v-strip-unsafe-html="store.citation" />
			</div>
		</div>

		<div :class="cn('actions')">
			<PkpButton :is-secondary="true" @click="store.copyToClipboard()">
				{{ store.copiedToClipboard ? t('common.copied') : t('common.copy') }}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import {useId} from 'vue';
import {usePkpCiteStore} from './usePkpCiteStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpCombobox from '@/frontend/components/PkpCombobox/PkpCombobox.vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCiteBody', props.styles);
const {t} = usePkpLocalize();
const labelId = useId();

const store = usePkpCiteStore();

function handleStyleSelect(item) {
	if (item) {
		store.switchStyle(item.value);
	}
}
</script>
