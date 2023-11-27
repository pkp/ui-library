<template>
	<div class="previewBadge">
		<badge label="32 submissions">32</badge>
		<badge label="4 assigned submissions" :is-primary="true">4</badge>
		<badge :is-success="true">Published</badge>
		<badge label="7 new messages" :is-warnable="true">7</badge>
		<badge label="Participant assigned as author" :has-dot="true">Author</badge>
		<badge
			label="Currently in the submission stage"
			stage="submission"
			:is-button="true"
		>
			Submission
		</badge>
		<badge label="View all layout editors" :is-button="true">
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
