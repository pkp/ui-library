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
								<BaseCommentsNotificationMessageNeedsApproval />
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
