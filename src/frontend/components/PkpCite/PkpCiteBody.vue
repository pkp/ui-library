<template>
	<div :class="cn('root')">
		<div :class="cn('outputWrapper')">
			<div
				:class="cn('output')"
				:data-loading="store.isLoading || undefined"
				aria-live="polite"
			>
				<div v-strip-unsafe-html="store.citation" />
			</div>
		</div>

		<div :class="cn('styleSelector')">
			<label :for="selectId" :class="cn('label')">
				{{ t('submission.howToCite.selectedFormat') }}
			</label>
			<select
				:id="selectId"
				:class="cn('select')"
				:value="store.activeStyleId"
				:aria-label="t('submission.howToCite.citationFormats')"
				@change="store.switchStyle($event.target.value)"
			>
				<option
					v-for="style in store.citationStyles"
					:key="style.id"
					:value="style.id"
				>
					{{ style.title }}
				</option>
			</select>
		</div>

		<div :class="cn('actions')">
			<PkpButton @click="store.copyToClipboard()">
				{{
					store.copiedToClipboard
						? t('common.copied')
						: t('submission.howToCite.copyToClipboard')
				}}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import {useId} from 'vue';
import {usePkpCiteStore} from './usePkpCiteStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpCiteBody', props.styles);
const {t} = usePkpLocalize();
const selectId = useId();

const store = usePkpCiteStore();
</script>
