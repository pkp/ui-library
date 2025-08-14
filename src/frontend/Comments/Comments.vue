<template>
	<CommentsVersions>
		<CommentsVersion>
			<CommentsVersionHeader></CommentsVersionHeader>
			<CommentsVersionContent>
				<CommentsLogInto></CommentsLogInto>
				<CommentsNew>
					<CommentsNewInput></CommentsNewInput>
					<CommentsNewSubmit></CommentsNewSubmit>
				</CommentsNew>
				<CommentsMessages class="flex flex-col gap-y-2">
					<CommentsMessage class="rounded bg-default p-4">
						<div class="flex justify-between">
							<CommentsMessageDate class="text-sm-light"></CommentsMessageDate>
							<CommentsMessageActions></CommentsMessageActions>
						</div>
						<CommentsMessageBody
							class="mt-2 block text-lg-normal"
						></CommentsMessageBody>

						<CommentsMessageAuthor class="mt-2 flex flex-col">
							<CommentsMessageAuthorName
								class="text-base-bold"
							></CommentsMessageAuthorName>
							<CommentsMessageAuthorOrcid
								class="text-xs-normal"
							></CommentsMessageAuthorOrcid>
							<CommentsMessageAuthorAffiliation
								class="text-sm-light"
							></CommentsMessageAuthorAffiliation>
						</CommentsMessageAuthor>
					</CommentsMessage>
				</CommentsMessages>
			</CommentsVersionContent>
		</CommentsVersion>
	</CommentsVersions>
</template>

<script setup>
import CommentsVersions from './CommentsVersions.vue';
import CommentsVersion from './CommentsVersion.vue';
import CommentsNew from './CommentsNew.vue';
import CommentsNewInput from './CommentsNewInput.vue';
import CommentsNewSubmit from './CommentsNewSubmit.vue';
import CommentsVersionHeader from './CommentsVersionHeader.vue';
import CommentsVersionContent from './CommentsVersionContent.vue';

import CommentsLogInto from './CommentsLogInto.vue';
import CommentsMessages from './CommentsMessages.vue';
import CommentsMessage from './CommentsMessage.vue';
import CommentsMessageDate from './CommentsMessageDate.vue';
import CommentsMessageActions from './CommentsMessageActions.vue';
import CommentsMessageBody from './CommentsMessageBody.vue';
import CommentsMessageAuthor from './CommentsMessageAuthor.vue';
import CommentsMessageAuthorName from './CommentsMessageAuthorName.vue';
import CommentsMessageAuthorOrcid from './CommentsMessageAuthorOrcid.vue';
import CommentsMessageAuthorAffiliation from './CommentsMessageAuthorAffiliation.vue';
</script>
./CommentsHeaderContent.vue./CommentsVersionHeaderLabel.vue
