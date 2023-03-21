## Props

| Key | Description |
| --- | --- |
| `activeReviewsCountLabel` | A localized string for the [Badge](#/component/badge) showing the number of active reviews. |
| `activeReviewsLabel` | A localized string for the active reviews row in the expanded table. |
| `assignedToLastRoundLabel` | A localized string that says this reviewer was assigned in the last review round. See `lastRoundReviewers` |
| `averageCompletionLabel` | A localized string for the average days to complete a review row in the expanded table.  |
| `biographyLabel` | A localized string for the biography section. |
| `cancelledReviewsLabel` | A localized string for the canceled reviews row in the expanded table.  |
| `completedReviewsLabel` | A localized string for the completed reviews row in the expanded table.  |
| `currentlyAssigned` | An array of user ids of reviewers who are already assigned to this review round. |
| `currentlyAssignedLabel` | A localized string that says this reviewer is already assigned to this review round. |
| `daySinceLastAssignmentLabel` | A localized string to use when it has only been one day since the reviewer's last assignment. |
| `daysSinceLastAssignmentLabel` | A localized string to use when it has been 2 or more days since the reviewer's last assignment. Example: `{$number} days ago` |
| `daysSinceLastAssignmentDescriptionLabel` | A localized string for the days since last assignment row in the expanded table.  |
| `declinedReviewsLabel` | A localized string for the declined reviews row in the expanded table.  |
| `emptyLabel` | A localized string to display when there are no reviewers to show in the list. |
| `filters` | An array [Filter](#/component/Filter)s. Default: `[]` |
| `gossipLabel` | A localized string for the gossip section. |
| `id` | A unique id for this component. |
| `items` | An array of reviewers. Default: `[]` |
| `itemsMax` | A count of all reviewers in the journal, press or preprint server. Default: `0` |
| `lastRoundReviewers` | An array of reviewers that were assigned in the last review round. Default: `[]` |
| `neverAssignedLabel` | A localized string to use when the reviewer has never been given a review assignment. |
| `reassignLabel` | A localized string to use for the button to reassign a reviewer who was assigned to the last review round. |
| `reassignWithNameLabel` | A localized string to use in an accessible label for the button to reassign a reviewer who was assigned to the last review round. Example: `Reassign {$name}` |
| `reviewerRatingLabel` | A localized string to use in an accessible label for the reviewer rating. |
| `reviewInterestsLabel` | A localized string to use for the reviewer interests section. |
| `selectorName` | |
| `selectReviewerLabel` | A localized string to use for the button to select a reviewer. |
| `title` | The title of the list panel. |
| `warnOnAssignment` | An array of user ids for reviewers that may not be able to conduct an anonymous review, because they have access to the submission details through another stage assignment. |
| `warnOnAssignmentLabel` | A localized string that describes why this user may be unable to conduct an anonymous review. |
| `warnOnAssignmentUnlockLabel` | A localized string for the button to unlock a reviewer who may be unable to conduct an anonymous review. |

## Events

| Key | Description |
| --- | --- |
| `set` | Emitted when a prop should be changed. Payload: `(id, newProps)` |

## Mixins

| Name | Description |
| --- | --- |
| [fetch](#/mixins/fetch) | Get reviewers from the REST API. |

## Usage

Use this component to select a reviewer for a review assignment.
