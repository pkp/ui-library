<template>
	<article :class="cn('root')">
		<div :class="cn('header')">
			<div :class="cn('author')">
				<a
					:id="`comment-${comment.id}`"
					:class="cn('anchor-link')"
					:name="`comment-${comment.id}`"
				></a>
				<h3 :class="cn('author-name')">
					{{ comment.userName }}
					<PkpOrcidDisplay
						v-if="comment.userOrcidDisplayValue"
						:class="cn('authorOrcid')"
						:orcid-url="comment.userOrcidDisplayValue"
						:is-verified="comment.isUserOrcidAuthenticated"
						variant="icon"
					/>
				</h3>
				<div v-if="comment.userAffiliation" :class="cn('author-affiliation')">
					{{ comment.userAffiliation }}
				</div>
			</div>
			<a :class="cn('permalink')" :href="`#comment-${comment.id}`">
				#{{ comment.id }}
				<svg
					:class="cn('permalink-icon')"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.075 20.5C6.81083 20.5 5.73233 20.0535 4.8395 19.1605C3.9465 18.2677 3.5 17.1892 3.5 15.925C3.5 15.3097 3.61383 14.7244 3.8415 14.1692C4.069 13.6141 4.40008 13.1193 4.83475 12.6848L8.02125 9.523L9.075 10.577L5.8885 13.7537C5.59233 14.0499 5.36858 14.3852 5.21725 14.7595C5.06608 15.134 4.9905 15.5225 4.9905 15.925C4.9905 16.7802 5.29075 17.5064 5.89125 18.1038C6.49192 18.7013 7.21983 19 8.075 19C8.4775 19 8.8685 18.9243 9.248 18.773C9.6275 18.6218 9.96533 18.3982 10.2615 18.102L13.4327 14.925L14.502 15.9943L11.3152 19.1557C10.8807 19.5904 10.3859 19.9231 9.83075 20.1538C9.27558 20.3846 8.69033 20.5 8.075 20.5ZM9.98275 15.077L8.923 14.0078L14.0173 8.9135L15.0865 9.98275L9.98275 15.077ZM15.9788 14.4923L14.925 13.4327L18.1115 10.2615C18.4013 9.97183 18.6193 9.644 18.7655 9.278C18.9115 8.91183 18.9845 8.5275 18.9845 8.125C18.9845 7.25967 18.6868 6.5225 18.0913 5.9135C17.4958 5.3045 16.7653 5 15.9 5C15.4975 5 15.109 5.07567 14.7345 5.227C14.3602 5.37817 14.0282 5.59867 13.7385 5.8885L10.5673 9.075L9.50775 8.02125L12.6848 4.84425C13.1193 4.40958 13.6141 4.07692 14.1693 3.84625C14.7244 3.61542 15.3097 3.5 15.925 3.5C17.1892 3.5 18.2651 3.94808 19.1528 4.84425C20.0406 5.74042 20.4845 6.82567 20.4845 8.1C20.4845 8.70517 20.3733 9.28367 20.151 9.8355C19.9285 10.3875 19.5999 10.8807 19.1652 11.3152L15.9788 14.4923Z"
						fill="currentColor"
					/>
				</svg>
			</a>
		</div>
		<div v-if="!comment.isApproved" :class="cn('pending')">
			<svg
				:class="cn('pending-icon')"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M2.5 11.9038V8.09625H4V11.9038H2.5ZM2.5 21.0385V14.0963H4V17.3848L5.4 16H7.90375V17.5H6.0385L2.5 21.0385ZM10.0963 17.5V16H13.9038V17.5H10.0963ZM16.0962 17.5V16H19.6923C19.7693 16 19.8398 15.9679 19.9038 15.9038C19.9679 15.8398 20 15.7692 20 15.6923V14.0963H21.5V15.6923C21.5 16.1974 21.325 16.625 20.975 16.975C20.625 17.325 20.1974 17.5 19.6923 17.5H16.0962ZM20 11.9038V8.09625H21.5V11.9038H20ZM20 5.91925V4.30775C20 4.23075 19.9679 4.16025 19.9038 4.09625C19.8398 4.03208 19.7693 4 19.6923 4H16.0962V2.5H19.6923C20.1974 2.5 20.625 2.675 20.975 3.025C21.325 3.375 21.5 3.80258 21.5 4.30775V5.91925H20ZM10.0963 4V2.5H13.9038V4H10.0963ZM2.5 5.91925V4.30775C2.5 3.80258 2.675 3.375 3.025 3.025C3.375 2.675 3.80258 2.5 4.30775 2.5H7.90375V4H4.30775C4.23075 4 4.16025 4.03208 4.09625 4.09625C4.03208 4.16025 4 4.23075 4 4.30775V5.91925H2.5Z"
					fill="currentColor"
				/>
			</svg>
			{{ t('userComment.awaitingApprovalNotice') }}
		</div>
		<div :class="cn('on')" v-html="store.getCommentedOn(comment)" />
		<div :class="cn('message')" v-html="comment.commentText"></div>
		<template v-if="store.getCurrentUser()">
			<PkpCommentDelete
				v-if="store.isCurrentUserComment(comment)"
				:comment="comment"
			/>
			<PkpCommentReport v-else :comment="comment" />
		</template>
	</article>
</template>

<script setup>
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import PkpCommentReport from './PkpCommentReport.vue';
import PkpCommentDelete from './PkpCommentDelete.vue';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpComment', props.styles);

const store = usePkpCommentsStore();

const {t} = usePkpLocalize();
</script>
