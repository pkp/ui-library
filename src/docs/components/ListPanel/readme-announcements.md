
## Props

| Key | Description |
| --- | --- |
| `addAnnouncementLabel` | A localized string for the button to add an announcement. |
| `confirmDeleteMessage` | A localized string for the confirmation message before deleting an announcement. |
| `deleteAnnouncementLabel` | A localized string for the button to delete an announcement. |
| `editAnnouncementLabel` | A localized string for the button to edit an announcement. |
| `form` | The [Form](#/component/Form) to edit an announcement. |
| `id` | A unique id for this component. |
| `items` | An array of announcements. |
| `itemsMax` | A count of all announcements in the journal, press or preprint server. |
| `title` | The title of the list panel. |
| `urlBase` | The base URL to view a a published announcement. Use `__id__` instead of the announcement ID. |

## Events

| Key | Description |
| --- | --- |
| `add:announcement` | Emitted when an announcement is added. Payload: `(announcement)` |
| `set` | Emitted when a prop should be changed. Payload: `(id, newProps)` |
| `update:announcement` | Emitted when an announcement is updated. Payload: `(announcement)` |

## Mixins

| Name | Description |
| --- | --- |
| [fetch](#/mixins/fetch) | Get announcements from the REST API. |

## Usage

Use this component to view, add, edit and delete announcements.