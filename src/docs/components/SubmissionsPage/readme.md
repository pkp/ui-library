## Data

This is a root component. Learn about [page hydration](#/pages/pages).

| Key | Type | Description |
| --- | --- | --- |
| `...` | mixed | All the data of [Page](#/component/Page). |
| `currentViewId` | String | The id of the currently selected view. |
| `submissions` | Array | The current list of submissions. |
| `submissionsMax` | Number | The total number of submissions available with the current view and filter settings. |
| `views` | Array | A list of preset views of the submissions list. |

## Mixins

| Name | Description |
| --- | --- |
| `ajaxError` | Display an unexpected error in a dialog. |
| `localizeSubmission` | Localize submission properties. |

## Usage

...
