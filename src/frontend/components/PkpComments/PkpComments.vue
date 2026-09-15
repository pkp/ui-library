<template>
	<section :class="cn('root')" :aria-label="t('manager.userComment.comments')">
		<slot :store="store">
			<PkpCommentsCta v-if="!store.comments.length">
				{{ t('userComment.noComments') }}
			</PkpCommentsCta>
			<PkpCommentsCta
				v-else-if="!store.isLatestPublication(store.comments[0].publicationId)"
			>
				{{ t('userComment.noCommentsLatestVersion') }}
			</PkpCommentsCta>
			<template v-for="(comment, i) in store.comments" :key="comment.id">
				<PkpCommentsVersionDivider
					v-if="store.isFirstCommentOnOldVersion(comment, i)"
				/>
				<PkpComment :comment="comment" />
			</template>
			<PkpCommentsShowMore v-if="store.showMoreCommentsCount" />
			<PkpCommentsCta v-if="!store.getCurrentUser()">
				{{ t('userComment.addCommentPrompt') }}
			</PkpCommentsCta>
			<PkpCommentAdd v-else></PkpCommentAdd>
		</slot>
	</section>
</template>

<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

import PkpCommentsShowMore from './PkpCommentsShowMore.vue';
import PkpComment from './PkpComment.vue';
import PkpCommentsCta from './PkpCommentsCta.vue';
import PkpCommentsVersionDivider from './PkpCommentsVersionDivider.vue';
import PkpCommentAdd from './PkpCommentAdd.vue';

const props = defineProps({
	submissionId: {type: Number, required: true},
	latestPublicationId: {type: Number, required: true},
	publications: {type: Array, default: () => []},
	itemsPerPage: {type: Number, required: true},
	loginUrl: {type: String, required: true},
	allCommentsCount: {type: Number, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn, nestedStyles} = usePkpStyles('PkpComments', props.styles);

const store = usePkpCommentsStore();
store.initialize(props, nestedStyles);

const {t} = usePkpLocalize();
</script>
