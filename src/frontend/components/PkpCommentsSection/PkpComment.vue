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
			<div :class="cn('header-actions')">
				<time
					:class="cn('header-date')"
					:datetime="formatLongDateTime(comment.createdAt)"
					:title="formatLongDateTime(comment.createdAt)"
				>
					{{ store.getDisplayDate(comment) }}
				</time>
				<PopoverRoot
					v-model:open="isMenuOpen"
					:class="cn('menu')"
					:dir="documentDir"
				>
					<PopoverTrigger :class="cn('menu-trigger')">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6.23047 13.5C5.81797 13.5 5.46489 13.3531 5.17122 13.0592C4.87739 12.7656 4.73047 12.4125 4.73047 12C4.73047 11.5875 4.87739 11.2344 5.17122 10.9408C5.46489 10.6469 5.81797 10.5 6.23047 10.5C6.64297 10.5 6.99614 10.6469 7.28997 10.9408C7.58364 11.2344 7.73047 11.5875 7.73047 12C7.73047 12.4125 7.58364 12.7656 7.28997 13.0592C6.99614 13.3531 6.64297 13.5 6.23047 13.5ZM11.9997 13.5C11.5872 13.5 11.2341 13.3531 10.9405 13.0592C10.6466 12.7656 10.4997 12.4125 10.4997 12C10.4997 11.5875 10.6466 11.2344 10.9405 10.9408C11.2341 10.6469 11.5872 10.5 11.9997 10.5C12.4122 10.5 12.7653 10.6469 13.059 10.9408C13.3528 11.2344 13.4997 11.5875 13.4997 12C13.4997 12.4125 13.3528 12.7656 13.059 13.0592C12.7653 13.3531 12.4122 13.5 11.9997 13.5ZM17.769 13.5C17.3565 13.5 17.0033 13.3531 16.7095 13.0592C16.4158 12.7656 16.269 12.4125 16.269 12C16.269 11.5875 16.4158 11.2344 16.7095 10.9408C17.0033 10.6469 17.3565 10.5 17.769 10.5C18.1815 10.5 18.5346 10.6469 18.8282 10.9408C19.1221 11.2344 19.269 11.5875 19.269 12C19.269 12.4125 19.1221 12.7656 18.8282 13.0592C18.5346 13.3531 18.1815 13.5 17.769 13.5Z"
								fill="currentColor"
							/>
						</svg>
						<span class="sr-only">
							{{ t('common.details') }}
						</span>
					</PopoverTrigger>
					<PopoverPortal>
						<PopoverContent :class="cn('menu-content')" align="end">
							<div :class="cn('menu-items')">
								<template v-if="store.getCurrentUser()">
									<button
										v-if="store.isCurrentUserComment(comment)"
										:class="cn('menu-item')"
										@click="openDelete"
									>
										<svg
											:class="cn('menu-item-icon')"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
										>
											<path
												d="M7.30775 20.5002C6.80908 20.5002 6.38308 20.3236 6.02975 19.9705C5.67658 19.6171 5.5 19.1911 5.5 18.6925V6.00022H4.5V4.50022H9V3.61572H15V4.50022H19.5V6.00022H18.5V18.6925C18.5 19.1976 18.325 19.6252 17.975 19.9752C17.625 20.3252 17.1974 20.5002 16.6923 20.5002H7.30775ZM17 6.00022H7V18.6925C7 18.7823 7.02883 18.8561 7.0865 18.9137C7.14417 18.9714 7.21792 19.0002 7.30775 19.0002H16.6923C16.7692 19.0002 16.8398 18.9681 16.9038 18.904C16.9679 18.84 17 18.7695 17 18.6925V6.00022ZM9.404 17.0002H10.9037V8.00022H9.404V17.0002ZM13.0962 17.0002H14.596V8.00022H13.0962V17.0002Z"
												fill="currentColor"
											/>
										</svg>
										<span :class="cn('menu-item-label')">
											{{ t('userComment.deleteComment') }}
										</span>
									</button>
									<button v-else :class="cn('menu-item')" @click="openReport">
										<svg
											:class="cn('menu-item-icon')"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											aria-hidden="true"
										>
											<path
												d="M1.86523 20.5L11.9997 3L22.1342 20.5H1.86523ZM4.44973 19H19.5497L11.9997 6L4.44973 19ZM12.5727 17.573C12.7292 17.4167 12.8075 17.2257 12.8075 17C12.8075 16.7743 12.7292 16.5833 12.5727 16.427C12.4164 16.2705 12.2254 16.1923 11.9997 16.1923C11.7741 16.1923 11.5831 16.2705 11.4267 16.427C11.2702 16.5833 11.192 16.7743 11.192 17C11.192 17.2257 11.2702 17.4167 11.4267 17.573C11.5831 17.7295 11.7741 17.8077 11.9997 17.8077C12.2254 17.8077 12.4164 17.7295 12.5727 17.573ZM11.2497 15.1923H12.7497V10.1923H11.2497V15.1923Z"
												fill="currentColor"
											/>
										</svg>
										<span :class="cn('menu-item-label')">
											{{ t('userComment.reportComment') }}
										</span>
									</button>
								</template>
								<PkpCopyToClipboard
									:class="[cn('menu-item'), cn('menu-item-copy')]"
									:copy="store.getUrl(comment)"
									:t-copied="t('common.copied')"
								>
									<svg
										:class="cn('menu-item-icon')"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden="true"
									>
										<path
											d="M8.075 20.5C6.81083 20.5 5.73233 20.0535 4.8395 19.1605C3.9465 18.2677 3.5 17.1892 3.5 15.925C3.5 15.3097 3.61383 14.7244 3.8415 14.1692C4.069 13.6141 4.40008 13.1193 4.83475 12.6848L8.02125 9.523L9.075 10.577L5.8885 13.7538C5.59233 14.0499 5.36858 14.3852 5.21725 14.7595C5.06608 15.134 4.9905 15.5225 4.9905 15.925C4.9905 16.7802 5.29075 17.5064 5.89125 18.1038C6.49192 18.7013 7.21983 19 8.075 19C8.4775 19 8.8685 18.9243 9.248 18.773C9.6275 18.6218 9.96533 18.3982 10.2615 18.102L13.4328 14.925L14.502 15.9942L11.3152 19.1557C10.8807 19.5904 10.3859 19.9231 9.83075 20.1538C9.27558 20.3846 8.69033 20.5 8.075 20.5ZM9.98275 15.077L8.923 14.0078L14.0173 8.9135L15.0865 9.98275L9.98275 15.077ZM15.9788 14.4923L14.925 13.4328L18.1115 10.2615C18.4013 9.97183 18.6193 9.644 18.7655 9.278C18.9115 8.91183 18.9845 8.5275 18.9845 8.125C18.9845 7.25967 18.6868 6.5225 18.0913 5.9135C17.4958 5.3045 16.7653 5 15.9 5C15.4975 5 15.109 5.07567 14.7345 5.227C14.3602 5.37817 14.0282 5.59867 13.7385 5.8885L10.5673 9.075L9.50775 8.02125L12.6848 4.84425C13.1193 4.40958 13.6141 4.07692 14.1693 3.84625C14.7244 3.61542 15.3097 3.5 15.925 3.5C17.1892 3.5 18.2651 3.94808 19.1527 4.84425C20.0406 5.74042 20.4845 6.82567 20.4845 8.1C20.4845 8.70517 20.3733 9.28367 20.151 9.8355C19.9285 10.3875 19.5999 10.8807 19.1652 11.3152L15.9788 14.4923Z"
											fill="currentColor"
										/>
									</svg>
									<span :class="cn('menu-item-label')">
										{{ t('userComment.copyLink') }}
									</span>
								</PkpCopyToClipboard>
							</div>
							<div :class="cn('menu-text-item')">
								<span v-html="store.getCommentedOn(comment)" />
							</div>
							<PopoverArrow :class="cn('menu-arrow')" />
						</PopoverContent>
					</PopoverPortal>
				</PopoverRoot>
			</div>
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
		<div :class="cn('message')" v-html="comment.commentText"></div>
	</article>
</template>

<script setup>
import {ref} from 'vue';
import {
	PopoverArrow,
	PopoverContent,
	PopoverPortal,
	PopoverRoot,
	PopoverTrigger,
} from 'reka-ui';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';
import {usePkpDirection} from '@/frontend/composables/usePkpDirection';
import {useDate} from '@/composables/useDate';
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import PkpCopyToClipboard from '../PkpCopyToClipboard/PkpCopyToClipboard.vue';

const props = defineProps({
	comment: {type: Object, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn} = usePkpStyles('PkpComment', props.styles);

const store = usePkpCommentsStore();

const documentDir = usePkpDirection();

const {t} = usePkpLocalize();

const {formatLongDateTime} = useDate();

const isMenuOpen = ref(false);

const closeMenu = () => (isMenuOpen.value = false);

const openDelete = () => {
	store.openDeleteModal(props.comment);
	closeMenu();
};

const openReport = () => {
	store.openReportModal(props.comment);
	closeMenu();
};
</script>
