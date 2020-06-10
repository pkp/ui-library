<template>
	<div class="previewBadge">
		<badge label="32 submissions">
			32
		</badge>
		<badge label="4 assigned submissions" :isPrimary="true">
			4
		</badge>
		<badge :isSuccess="true">
			Published
		</badge>
		<badge label="7 new messages" :isWarnable="true">
			7
		</badge>
		<badge label="Participant assigned as author" :hasDot="true">
			Author
		</badge>
		<badge
			label="Currently in the submission stage"
			stage="submission"
			:isButton="true"
		>
			Submission
		</badge>
		<badge label="View all layout editors" :isButton="true">
			Layout Editor
		</badge>
		<badge label="25 comments">
			<icon icon="comment-o" :inline="true" />
			25
		</badge>
	</div>
</template>

<style lang="less">
.previewBadge {
	display: flex;
	flex-wrap: wrap;
	margin-top: -1rem;
	margin-left: -1rem;

	> * {
		margin-top: 1rem;
		margin-left: 1rem;
	}
}
</style>
