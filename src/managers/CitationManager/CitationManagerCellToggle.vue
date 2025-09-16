<template>
	<TableCell :is-row-header="false" class="!text-center">
		<span
			v-if="citationStore.citationsMetadataLookup"
			class="text-base-normal"
		>
			<a
				v-if="citation.isStructured"
				@click="toggleStatusRowChanged"
				class="cursor-pointer uppercase"
			>
				<Icon
					:icon="toggleStatusRow ? 'Dropup' : 'Dropdown'"
					:class="'ms-2 inline-block h-auto w-6 cursor-pointer py-2 align-middle'"
					:inline="true"
				/>
			</a>
		</span>
		<span v-else>&nbsp;</span>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';

const {t} = useLocalize();

const props = defineProps({
	citation: {type: Object, required: true},
});

const citation = computed(() => props.citation);

const citationStore = useCitationManagerStore();

const toggleStatusRow = computed(() => {
	return !!citationStore.toggleStatusRows[citation.value.id];
});

function toggleStatusRowChanged() {
	citationStore.toggleStatusRowChanged(citation.value.id);
}
</script>
