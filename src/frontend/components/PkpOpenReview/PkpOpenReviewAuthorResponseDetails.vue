<template>
	<div v-if="authors.length" :class="cn('root')">
		<template v-for="(author, index) in authors" :key="author.id">
			<span v-if="index > 0" :class="cn('separator')">
				{{ t('common.commaListSeparator') }}
			</span>
			<span :class="cn('author')">
				<span :class="cn('authorName')">{{ author.fullName }}</span>
				<PkpOrcidDisplay
					v-if="author.orcid"
					variant="icon"
					:class="cn('authorOrcid')"
					:orcid-url="author.orcid"
					:is-verified="author.hasVerifiedOrcid"
				/>
			</span>
		</template>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';

const props = defineProps({
	authorResponse: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpOpenReviewAuthorResponseDetails', props.styles);
const {t} = usePkpLocalize();

const authors = computed(() => props.authorResponse.associatedAuthors ?? []);
</script>
