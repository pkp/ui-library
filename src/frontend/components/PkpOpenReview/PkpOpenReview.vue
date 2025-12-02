<template>
	<BaseOpenReview>
		<!--<BaseOpenReviewSortBy></BaseOpenReviewSortBy>
		<BaseOpenReviewHeading></BaseOpenReviewHeading>-->
		<BaseOpenReviewRounds v-slot="roundProps">
			<BaseOpenReviewRound v-bind="roundProps">
				<BaseOpenReviewRoundHeader>
					<div>
						<span>{{ roundProps.label }} {{ roundProps.date }}</span>
						<span>({{ roundProps.reviewerCount }} reviewers)</span>
					</div>
					<div>
						<span
							v-for="summaryItem in roundProps.summary"
							:key="summaryItem.id"
						>
							<PkpIcon :icon="summaryItem.icon"></PkpIcon>
							{{ summaryItem.count }}
							{{ summaryItem.label }}
						</span>
					</div>
				</BaseOpenReviewRoundHeader>
				<BaseOpenReviewRoundContent>
					<BaseOpenReviewRoundReview v-slot="reviewProps">
						<PkpIcon :icon="reviewProps.icon"></PkpIcon>
						{{ reviewProps.statusLabel }}
						{{ reviewProps.reviewerName }}
						{{ reviewProps.reviewerAffiliation }}
						<BaseOpenReviewRoundReviewRead />
					</BaseOpenReviewRoundReview>
				</BaseOpenReviewRoundContent>
			</BaseOpenReviewRound>
		</BaseOpenReviewRounds>
	</BaseOpenReview>
</template>
