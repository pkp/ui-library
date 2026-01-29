<template>
	<section :class="cn('root')" :aria-label="t('manager.userComment.comments')">
		<slot :publications="store.publications" :store="store">
			<PkpAccordionRoot :default-value="store.publications[0]?.id" collapsible>
				<PkpAccordionItem
					v-for="publication in store.publications"
					:key="publication.id"
					:value="publication.id"
					:class="cn('version')"
				>
					<PkpAccordionHeader>
						<slot
							name="versionHeader"
							:publication="publication"
							:messages="store.getComments(publication.id)"
							:store="store"
						>
							<BaseCommentsVersionHeaderLabel :publication="publication" />
						</slot>
					</PkpAccordionHeader>
					<PkpAccordionContent :class="cn('content')">
						<BaseCommentsLogInto :publication="publication" />
						<BaseCommentsNotificationNotLatest :publication="publication" />
						<slot name="newComment" :publication="publication" :store="store">
							<BaseCommentsNew :publication="publication">
								<BaseCommentsNewInput />
								<BaseCommentsNewSubmit :publication="publication" />
							</BaseCommentsNew>
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
									<BaseCommentsNotificationMessageNeedsApproval
										:message="message"
									/>
									<div :class="cn('messageHeader')">
										<time
											:class="cn('messageDate')"
											:datetime="message.createdAt"
										>
											{{ formatShortDateTime(message.createdAt) }}
										</time>
										<BaseCommentsMessageActions
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
import {usePkpCommentsStore} from '../usePkpCommentsStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

// Import Base content components
import BaseCommentsVersionHeaderLabel from './BaseCommentsVersionHeaderLabel.vue';
import BaseCommentsLogInto from './BaseCommentsLogInto.vue';
import BaseCommentsNotificationNotLatest from './BaseCommentsNotificationNotLatest.vue';
import BaseCommentsNew from './BaseCommentsNew.vue';
import BaseCommentsNewInput from './BaseCommentsNewInput.vue';
import BaseCommentsNewSubmit from './BaseCommentsNewSubmit.vue';
import BaseCommentsNotificationMessageNeedsApproval from './BaseCommentsNotificationMessageNeedsApproval.vue';
import BaseCommentsMessageActions from './BaseCommentsMessageActions.vue';
import PkpOrcidDisplay from '@/frontend/components/PkpOrcidDisplay/PkpOrcidDisplay.vue';
import {formatShortDateTime} from '@/utils/dateUtils';

const props = defineProps({
	latestPublicationId: {type: Number, required: true},
	publications: {type: Array, default: () => []},
	itemsPerPage: {type: Number, required: true},
	loginUrl: {type: String, required: true},
	commentsCountPerPublication: {type: Object, required: true},
	allCommentsCount: {type: Number, required: true},
});

const {cn} = usePkpStyles();

const store = usePkpCommentsStore();
store.initialize(props);

const {t} = usePkpLocalize();
</script>
