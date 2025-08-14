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
				<CommentsMessages>
					<CommentsMessage>
						<CommentsMessageDate></CommentsMessageDate>
						<CommentsMessageActions></CommentsMessageActions>
						<CommentsMessageBody></CommentsMessageBody>
						<CommentsMessageAuthor>
							<CommentsMessageAuthorName></CommentsMessageAuthorName>
							<CommentsMessageAuthorOrcid></CommentsMessageAuthorOrcid>
							<CommentsMessageAuthorAffiliation></CommentsMessageAuthorAffiliation>
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
