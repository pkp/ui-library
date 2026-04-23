<template>
	<section :class="cn('root')" :aria-label="t('userComment.comments')">
		<slot :publications="store.publications" :store="store">
			<PkpAccordionRoot
				:default-value="
					store.publications[0]?.id ? String(store.publications[0].id) : null
				"
				collapsible
			>
				<PkpAccordionItem
					v-for="publication in store.publications"
					:key="publication.id"
					:value="String(publication.id)"
					:class="cn('version')"
				>
					<PkpAccordionHeader>
						<slot
							name="versionHeader"
							:publication="publication"
							:messages="store.getComments(publication.id)"
							:store="store"
						>
							<span :class="cn('versionHeaderLabel')">
								{{ store.getVersionLabel(publication.id) }}
							</span>
						</slot>
					</PkpAccordionHeader>
					<PkpAccordionContent :class="cn('content')">
						<PkpCommentsLogInto :publication="publication" />
						<PkpCommentsNotificationNotLatest :publication="publication" />
						<slot name="newComment" :publication="publication" :store="store">
							<PkpCommentsNew :publication="publication">
								<PkpCommentsNewInput />
								<PkpCommentsNewSubmit :publication="publication" />
							</PkpCommentsNew>
						</slot>
						<div :class="cn('messages')">
							<article
								v-for="message in store.getComments(publication.id)"
								:key="message.id"
								:class="cn('message')"
							>
								<slot
									name="message"
									:message="message"
									:publication="publication"
									:store="store"
								>
									<PkpCommentsNotificationMessageNeedsApproval
										:message="message"
									/>
									<div :class="cn('messageHeader')">
										<time
											:class="cn('messageDate')"
											:datetime="message.createdAt"
										>
											{{ formatShortDateTime(message.createdAt) }}
										</time>
										<PkpCommentsMessageActions
											:publication="publication"
											:message="message"
										/>
									</div>
									<div
										v-strip-unsafe-html="message.commentText.trim()"
										:class="cn('messageBody')"
									></div>
									<footer :class="cn('messageAuthor')">
										<span :class="cn('authorName')">
											{{ message.userName }}
										</span>
										<PkpOrcidDisplay
											v-if="message.userOrcidDisplayValue"
											:class="cn('authorOrcid')"
											:orcid-url="message.userOrcidDisplayValue"
											:is-verified="message.isUserOrcidAuthenticated"
										/>
										<span :class="cn('authorAffiliation')">
											{{ message.userAffiliation }}
										</span>
									</footer>
								</slot>
							</article>
						</div>
						<PkpCommentsShowMore
							:publication="publication"
						></PkpCommentsShowMore>
					</PkpAccordionContent>
				</PkpAccordionItem>
			</PkpAccordionRoot>
		</slot>
	</section>
</template>

<script setup>
import PkpAccordionRoot from '@/frontend/components/PkpAccordion/PkpAccordionRoot.vue';
import PkpAccordionItem from '@/frontend/components/PkpAccordion/PkpAccordionItem.vue';
import PkpAccordionHeader from '@/frontend/components/PkpAccordion/PkpAccordionHeader.vue';
import PkpAccordionContent from '@/frontend/components/PkpAccordion/PkpAccordionContent.vue';
import {usePkpCommentsStore} from './usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

import PkpCommentsLogInto from './PkpCommentsLogInto.vue';
import PkpCommentsNotificationNotLatest from './PkpCommentsNotificationNotLatest.vue';
import PkpCommentsNew from './PkpCommentsNew.vue';
import PkpCommentsNewInput from './PkpCommentsNewInput.vue';
import PkpCommentsNewSubmit from './PkpCommentsNewSubmit.vue';
import PkpCommentsNotificationMessageNeedsApproval from './PkpCommentsNotificationMessageNeedsApproval.vue';
import PkpCommentsMessageActions from './PkpCommentsMessageActions.vue';
import PkpCommentsShowMore from './PkpCommentsShowMore.vue';
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import {formatShortDateTime} from '@/utils/dateUtils';

const props = defineProps({
	latestPublicationId: {type: Number, required: true},
	publications: {type: Array, default: () => []},
	itemsPerPage: {type: Number, required: true},
	loginUrl: {type: String, required: true},
	commentsCountPerPublication: {type: Object, required: true},
	allCommentsCount: {type: Number, required: true},
	styles: {type: Object, default: () => ({})},
});

const {cn, nestedStyles} = usePkpStyles('PkpComments', props.styles);

const store = usePkpCommentsStore();
store.initialize(props, nestedStyles);

const {t} = usePkpLocalize();
</script>
