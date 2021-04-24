## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase). |
| `value` | The current value for this field. |
| `options` | An array of objects defining the options which can be selected. |
| `publicationStatus` | One of the `PKPSubmission::STATUS_` constants. When set to `PKPSubmission::STATUS_QUEUED` or `PKPSubmission::STATUS_PUBLISHED` the issue selection will be hidden. |
| `publishedNoticeBase` | Text to be displayed when the publication is published in an issue. A string replace will be called to replace `{$issueId}` and `{$issueName}` params with the selected issue. |
| `scheduledNoticeBase` | Text to be displayed when the publication is scheduled for publication in an issue. A string replace will be called to replace `{$issueId}` and `{$issueName}` params with the selected issue. |
| `unscheduleLabel` | The label for the button to unschedule a scheduled publication. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

A special component for selecting an issue.

When a publication is scheduled or published, this field will no longer show the selection options and will instead show a message indicating the issue it was scheduled or published in.
