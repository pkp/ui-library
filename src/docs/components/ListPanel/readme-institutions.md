## Props

| Key | Description |
| --- | --- |
| `addInstitutionLabel` | A localized string for the button to add an institution. |
| `confirmDeleteMessage` | A localized string for the confirmation message before deleting an institution. |
| `deleteInstitutionLabel` | A localized string for the button to delete an institution. |
| `editInstitutionLabel` | A localized string for the button to edit an institution. |
| `form` | The [Form](#/component/Form) to edit an institution. |
| `id` | A unique id for this component. |
| `items` | An array of institutions. |
| `itemsMax` | A count of all institutions in the journal, press or preprint server. |
| `title` | The title of the list panel. |

## Events

| Key | Description |
| --- | --- |
| `add:institution` | Emitted when an institution is added. Payload: `(institution)` |
| `set` | Emitted when a prop should be changed. Payload: `(id, newProps)` |
| `update:institution` | Emitted when an institution is updated. Payload: `(institution)` |

## Mixins

| Name | Description |
| --- | --- |
| `ajaxError` | Display an unexpected error in a [Dialog](#/mixins/dialog). |
| [fetch](#/mixins/fetch) | Get institutions from the REST API. |

## Usage

Use this component to view, add, edit and delete institutions.