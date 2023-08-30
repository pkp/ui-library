
## Props

| Key | Description |
| --- | --- |
| `apiUrl` | The URL to the REST API endpoint for highlights. |
| `form` | The [Form](#/component/Form) to edit a highlight. |
| `i18nAdd` | A localized string for the button to add a highlight. |
| `i18nConfirmDelete` | A localized string for the confirmation message before deleting a highlight. |
| `i18nDelete` | A localized string for the button to delete a highlight. |
| `i18nEdit` | A localized string for the button to edit a highlight. |
| `id` | A unique id for this component. |
| `items` | An array of highlights. |
| `itemsMax` | A count of all highlights in the journal, press or preprint server, or in the site for site-level highlights. |
| `title` | The title of the list panel. |

## Events

| Key | Scope | Description |
| --- | --- | --- |
| `add:highlight` | [Event Bus](http://localhost:8080/#/pages/event-bus) | Emitted when a highlight is added. Payload: `(highlight)` |
| `set` | Component | Emitted when a prop should be changed. Payload: `(id, newProps)` |
| `update:highlight` | [Event Bus](http://localhost:8080/#/pages/event-bus) | Emitted when a highlight is updated. Payload: `(highlight)` |

## Global Events


## Mixins

| Name | Description |
| --- | --- |
| [dialog](#/mixins/dialog) | Open a dialog modal. |
| [fetch](#/mixins/fetch) | Get highlights from the REST API. |

## Usage

Use this component to view, add, edit and delete highlights.