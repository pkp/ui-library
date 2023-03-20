## Props

| Key | Description |
| --- | --- |
| `addUrl` | The URL to make a new submission. |
| `allowSubmissions` | Whether or not the journal, press or preprint server allows submissions. Default: `true` |
| `assignParticipantUrl` | The URL to the component handler to assign a participant to a submission. |
| `filters` | An array of [Filters](#/component/Filter) to change the view of the submissions list. |
| `id` | A unique id for this component. |
| `infoUrl` | The URL to the component handler for the submission's activity log and notes. |
| `items` | An array of submissions. |
| `itemsMax` | A count of all submissions the user can access in the journal, press or preprint server. |
| `title` | The title of the list panel. |

## Events

| Key | Description |
| --- | --- |
| `set` | Emitted when a prop should be changed. Payload: `(id, newProps)` |

## Mixins

| Name | Description |
| --- | --- |
| [fetch](#/mixins/fetch) | Get submissions from the REST API. |

## Usage

Use this component to help editors, authors and reviewers track submissions and editorial assignments.
