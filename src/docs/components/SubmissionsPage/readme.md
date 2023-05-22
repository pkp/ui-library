## Data

This is a root component. Learn about [page hydration](#/pages/pages).

| Key | Type | Description |
| --- | --- | --- |
| `...` | mixed | All the data of [Page](#/component/Page). |
| `activeFilters` | Array | The filters currently applied to the list. |
| `apiUrl` | String | The URL to the submissions API endpoint. |
| `assignParticipantUrl` | String | The URL to open the assign participant modal. |
| `count` | Number | The number of submissions to show per page. |
| `currentViewId` | String | The id of the currently selected view. See `views`. |
| `filtersForm` | Object | The form to edit filters. |
| `i18nReviewRound` | String | A localized string used to show the current round of review. |
| `i18nShowingXofX` | String | A localized string used to describe how many submissions are currently being shown. |
| `isLoadingPage` | Boolean | True when a new page of submissions is being loaded. |
| `isLoadingSubmissions` | Boolean | True when a request to change the submissions list is pending. |
| `offset` | Number | Used to calculate what page is being shown. |
| `searchPhrase` | String | The phrase to search for submissions. |
| `sortColumn` | String | The id of the column submissions are currently sorted by. |
| `sortDirection` | String | The direction that submissions are sorted in. One of `none`, `ascending`, or `descending`. |
| `submissions` | Array | The submissions to show in the table. |
| `submissionsMax` | Number | The total number of submissions matching the current view, search, and filter criteria. |
| `summarySubmission` | Object, null | The submission currently being shown in the summary panel, or null when the summary panel is closed. |
| `views` | Array | The list of views that can be selected in the left, such as "Assigned to Me". |

## Mixins

| Name | Description |
| --- | --- |
| `ajaxError` | Display an unexpected error in a dialog. |
| `localizeSubmission` | Localize submission properties. |

## Usage

...
