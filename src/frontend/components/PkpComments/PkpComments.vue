<template>
	<BaseComments v-bind="$attrs">
		<BaseCommentsVersions v-slot="versionProps">
			<BaseCommentsVersion class="" v-bind="versionProps">
				<BaseCommentsVersionHeader>
					<BaseCommentsVersionHeaderTrigger>
						<BaseCommentsVersionHeaderLabel></BaseCommentsVersionHeaderLabel>
						<BaseCommentsVersionHeaderChevron></BaseCommentsVersionHeaderChevron>
					</BaseCommentsVersionHeaderTrigger>
				</BaseCommentsVersionHeader>
				<BaseCommentsVersionContent>
					<BaseCommentsLogInto></BaseCommentsLogInto>
					<BaseCommentsNotificationNotLatest></BaseCommentsNotificationNotLatest>
					<BaseCommentsNew>
						<BaseCommentsNewInput></BaseCommentsNewInput>
						<BaseCommentsNewSubmit></BaseCommentsNewSubmit>
					</BaseCommentsNew>
					<BaseCommentsMessages>
						<template #default="messageProps">
							<BaseCommentsMessage v-bind="messageProps">
								<BaseCommentsNotificationMessageApproved />
								<div class="BaseCommentsMessageHeader">
									<BaseCommentsMessageDate></BaseCommentsMessageDate>
									<BaseCommentsMessageActions></BaseCommentsMessageActions>
								</div>
								<BaseCommentsMessageBody></BaseCommentsMessageBody>

								<BaseCommentsMessageAuthor>
									<BaseCommentsMessageAuthorName></BaseCommentsMessageAuthorName>
									<BaseCommentsMessageAuthorOrcid></BaseCommentsMessageAuthorOrcid>
									<BaseCommentsMessageAuthorAffiliation></BaseCommentsMessageAuthorAffiliation>
								</BaseCommentsMessageAuthor>
							</BaseCommentsMessage>
						</template>
					</BaseCommentsMessages>
				</BaseCommentsVersionContent>
			</BaseCommentsVersion>
		</BaseCommentsVersions>
	</BaseComments>
</template>

<script setup>
import BaseComments from './base/BaseComments.vue';
import BaseCommentsVersions from './base/BaseCommentsVersions.vue';
import BaseCommentsVersion from './base/BaseCommentsVersion.vue';
import BaseCommentsNew from './base/BaseCommentsNew.vue';
import BaseCommentsNewInput from './base/BaseCommentsNewInput.vue';
import BaseCommentsNewSubmit from './base/BaseCommentsNewSubmit.vue';
import BaseCommentsVersionHeader from './base/BaseCommentsVersionHeader.vue';
import BaseCommentsVersionHeaderTrigger from './base/BaseCommentsVersionHeaderTrigger.vue';
import BaseCommentsVersionHeaderLabel from './base/BaseCommentsVersionHeaderLabel.vue';
import BaseCommentsVersionHeaderChevron from './base/BaseCommentsVersionHeaderChevron.vue';

import BaseCommentsVersionContent from './base/BaseCommentsVersionContent.vue';

import BaseCommentsLogInto from './base/BaseCommentsLogInto.vue';
import BaseCommentsMessages from './base/BaseCommentsMessages.vue';
import BaseCommentsNotificationNotLatest from './base/BaseCommentsNotificationNotLatest.vue';
import BaseCommentsMessage from './base/BaseCommentsMessage.vue';
import BaseCommentsNotificationMessageApproved from './base/BaseCommentsNotificationMessageApproved.vue';
import BaseCommentsMessageDate from './base/BaseCommentsMessageDate.vue';
import BaseCommentsMessageActions from './base/BaseCommentsMessageActions.vue';
import BaseCommentsMessageBody from './base/BaseCommentsMessageBody.vue';
import BaseCommentsMessageAuthor from './base/BaseCommentsMessageAuthor.vue';
import BaseCommentsMessageAuthorName from './base/BaseCommentsMessageAuthorName.vue';
import BaseCommentsMessageAuthorOrcid from './base/BaseCommentsMessageAuthorOrcid.vue';
import BaseCommentsMessageAuthorAffiliation from './base/BaseCommentsMessageAuthorAffiliation.vue';
</script>
<style></style>
