## Data

This is a root component. Learn about [page hydration](#/pages/pages).

| Key | Description |
| --- | --- |
| `...` | All the data of [Page](#/component/Page). |
| `activeFilters` | An object containing the currently active [Filters](#/component/Filter). |
| `currentMailable` | The `Mailable` currently open in a modal. |
| `currentTemplate` | The `EmailTemplate` currently open in a modal. |
| `currentTemplateForm` | A copy of the form to add or edit an `EmailTemplate` that is currently open in a modal. This form may have an email template's details loaded into it. |
| `i18nRemoveTemplate` | A localized string for the button to remove a template. |
| `i18nRemoveTemplateMessage` | A localized string for the confirmation message when removing a template. |
| `i18nResetAll` | A localized string for the button to reset all email templates. |
| `i18nResetAllMessage` | A localized string for the confirmation message when removing a template. |
| `mailables` | An array of all `Mailable`s active in this journal, press or preprint server. |
| `mailablesApiUrl` | The URL to the `/mailables` endpoint in the REST API. |
| `resetFocusTo` | Used to reset focus when a modal is closed. Default: `{}` |
| `searchPhrase` | The value of the search input. Default: `''` |
| `templateForm` | A "clean" copy of the form to add or edit an `EmailTemplate`. The `currentTemplateForm` is a copy of this form that has been modified to add or edit a specific template. |
| `templatesApiUrl` | The URL to the `/emailTemplates` endpoint in the REST API. |


## Mixins

| Name | Description |
| --- | --- |
| [dialog](#/mixins/dialog) | Show confirmation prompts. |

## Usage

The `ManageEmailsPage` extends the [`Page`](#/component/Page) component. This page is where editors can edit email templates assigned to mailables.
