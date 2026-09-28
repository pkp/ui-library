<template>
	<div :class="cn('root')">
		<hr :class="cn('divider')" />
		<div :class="cn('button-bg')">
			<PkpButton
				:class="cn('button')"
				:is-disabled="isLoading"
				@click="loadMore"
			>
				<span v-if="isLoading" :class="cn('loading')">
					<PkpSpinner :class="cn('spinner')" />
					{{ t('common.loading') }}
				</span>
				<template v-else>
					{{
						t('userComment.showMore', {
							count: store.showMoreCommentsCount,
						})
					}}
				</template>
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {ref} from 'vue';

const props = defineProps({
	publication: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {t} = usePkpLocalize();
const {cn} = usePkpStyles('PkpCommentsShowMore', props.styles);
const store = usePkpCommentsStore();

const isLoading = ref(false);

const loadMore = () => {
	isLoading.value = true;
	store.loadComments().finally(() => {
		isLoading.value = false;
	});
};
</script>
