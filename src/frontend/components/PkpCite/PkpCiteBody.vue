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
				{{ props.tSelectedFormat }}
			</label>
			<select
				:id="selectId"
				:class="cn('select')"
				:value="store.activeStyleId"
				:aria-label="props.tCitationFormats"
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
			<PkpCopyToClipboard :copy="store.citation" :t-copied="props.tCopied">
				{{ props.tCopyToClipboard }}
			</PkpCopyToClipboard>
		</div>
	</div>
</template>

<script setup>
import {useId} from 'vue';
import {usePkpCiteStore} from './usePkpCiteStore';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpCopyToClipboard from '../PkpCopyToClipboard/PkpCopyToClipboard.vue';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
	tSelectedFormat: {type: String},
	tCitationFormats: {type: String},
	tCopyToClipboard: {type: String},
	tCopied: {type: String},
	citation: {type: String},
	citationArgs: {type: Object},
	citationArgsJson: {type: Object},
	citationStyles: {type: Array},
	citationDownloads: {type: Array},
	citationPrimaryStyle: {type: String},
});

const {cn} = usePkpStyles('PkpCiteBody', props.styles);
const selectId = useId();

const store = usePkpCiteStore();
store.initialize({
	citation: props.citation,
	citationArgs: props.citationArgs,
	citationArgsJson: props.citationArgsJson,
	citationStyles: props.citationStyles,
	citationDownloads: props.citationDownloads,
	citationPrimaryStyle: props.citationPrimaryStyle,
});
</script>
