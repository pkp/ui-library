## Data

This is a root component. Learn about [page hydration](#/pages/pages).

| Key | Description |
| --- | --- |
| `...` | All the data of [Page](#/component/Page). |
| `autosavesKeyBase` | A unique string. See autosave mixin below. Default: `'submitAutosaves'` |
| `categories` | **Required** A key/value map of category ids and category names. Example: `{12: "Social Sciences > Sociology"}`. Not required if there is no categories field in the submission wizard. Default: `{}` |
| `currentStepId` | Default: `''` |
| `errors` | A key/value map of submission validation errors. Default: `{}` |
| `i18nConfirmSubmit` | **Required** A localized string for the confirmation message before submitting. |
| `i18nDiscardChanges` | **Required** A localized string for the button to discard changes when unsaved changes are found. |
| `i18nDisconnected` | **Required** A localized string to show when there is no connection to the server. |
| `i18nLastAutosaved` | **Required** A localized string describing when the last autosave occured. |
| `i18nPageTitle` | **Required** A localized string describing the page with the step. This is used in the page `<title>` so that the browser tab and browser history provide useful information. Example: `Make a Submission: {$step}`. |
| `i18nSubmit` | **Required** A localized string for the submit button. |
| `i18nTitleSeparator` | **Required** A localized string to use as a separator in the page title. See `i18nPageTitle`. |
| `i18nUnableToSave` | **Required** A localized string to show when an error occurred during an autosave, such as a failure to connect to the server. |
| `i18nUnsavedChanges` | **Required** A localized string for the title of the dialog that appears when unsaved changes are found in local storage. |
| `i18nUnsavedChangesMessage` | **Required** A localized string for the message of the dialog that appears when unsaved changes are found in local storage. |
| `isValidating` | Is the submission validation request pending? Default: `false` |
| `lastAutosavedMessage` | A localized string describing when the last save was completed. Uses `i18nLastAutosaved`. Default: `''` |
| `publication` | **Required** The `Publication` being edited. |
| `publicationApiUrl` | **Required** The URL to the REST API endpoint for this `Publication`. |
| `reconfigurePublicationProps` | An array of `Publication` property names which can be edited by the form to reconfigure the submission. See "Reconfigure Submission" below. Default: `[]` |
| `reconfigureSubmissionProps` | An array of `Submission` property names which can be edited by the form to reconfigure the submission. See "Reconfigure Submission" below. Default: `[]` |
| `staleForms` | An array of ids of forms that have changed since the last save. Default: `[]` |
| `startedSteps` | An array of ids of steps that have been started. Default: `[]` |
| `steps` | **Required** An array of steps. See "Steps and Sections" below. |
| `submission` | The `Submission` being edited. Default: `{}` |
| `submissionApiUrl` | **Required** The URL to the REST API endpoint for this submission. |
| `submissionSavedUrl` | **Required** The URL to the page to show when a submission is saved for later. |
| `submissionWizardUrl` | **Required** The URL to the submission wizard page. |
| `submitApiUrl` | **Required** The URL to the REST API endpoint to submit this submission. |

## Mixins

| Name | Description |
| --- | --- |
| `ajaxError` | Displays a [Dialog](#/mixins/dialog) when an unexpected response is encountered. |
| [autosave](#/pages/autosave) | Autosave the user's progress. |
| [dialog](#/mixins/dialog) | Show confirmation prompts. |
| [localizeMoment](#/pages/localizeMoment) | Localize the last saved message. |
| `localizeSubmission` | Localize submission properties. |
| [localStorage](#/pages/localStorage) | Save ther user's progress to local storage when connection lost. |

## Usage

<div class="pkpNotification pkpNotification--warning">
This component preview is only partially functional. The component uses the server to save and sync data, so information in the review step is not updated based on input from earlier steps. Also, it is not possible to add contributors, upload files, or make use of the autosave features.
</div>

The `<SubmissionWizardPage>` extends the [Page](#/component/Page) component. Use this page to show the submission wizard. This makes use of the [SubmissionFilesListPanel](#/component/ListPanel/components/SubmissionFilesListPanel) and `<ContributorsListPanel>`. Add props for these components to the `components` prop.

```json
{
    "components": {
        "contributors": {...},
        "submissionFiles": {...}
    }
}
```

## Steps, Sections and Review

The `steps` property is an array of steps. Each step includes an id, name, an array of sections, and information about how these sections should be displayed in the review step.

```json
[
    {
        "id": "details",
        "name": "Details",
        "reviewName": "Details You Entered",
        "reviewTemplate": "/submission/review-details.tpl",
        "sections": [
            ...
        ]
    }
]
```

The `reviewTemplate` points to a [template file](https://docs.pkp.sfu.ca/dev/documentation/en/frontend-pages#smarty) that can display the entered information on the review stage. This is not used in the browser, but is part of how the steps are defined for the server-side templates. Server-side templating is used so that plugins can make use of [template overrides](https://docs.pkp.sfu.ca/dev/plugin-guide/en/templates) to customize the wizard.

All sections include a name and description, and must be one of the recognized types. The `contributors` type will display a `<ContributorsListPanel>`. It will pull the component's props from the `components.contributors` and `publication` props of this page.

```json
{
    "id": "contributors",
    "name": "Contributors",
    "description": "Please add all the contributors to this submission.",
    "type": "contributors" // APP\pages\submission\SubmissionHandler::SECTION_TYPE_CONTRIBUTORS
}
```

The `files` type will display a [SubmissionFilesListPanel](#/component/ListPanel/components/SubmissionFilesListPanel). It will pull the component's props from the `components.submissionFiles` props of this page.

```json
{
    "id": "files",
    "name": "Upload Files",
    "description": "Please upload all files our editorial staff need to evaluate your submission.",
    "type": "files" // APP\pages\submission\SubmissionHandler::SECTION_TYPE_FILES
}
```

The `form` type will display a [Form](#/component/Form) and autosave all changes to it. The form's props should be passed with the section.

```json
{
    "id": "details",
    "name": "Details",
    "description": "Please enter the title, abstract and other information about this submission.",
    "type": "form", // APP\pages\submission\SubmissionHandler::SECTION_TYPE_FORM
    "form": {
        ...
    }
}
```

The `confirm` type is a special type that is used in the review step to prevent the submission from being submitted before the author has confirmed the copyright notice. When used this way, the section id should be `confirmSubmission`. It will display a [Form](#/componentForm) that will not be autosaved. The form's props should be passed with the section.

```json
{
    "id": "confirmSubmission",
    "name": "Copyright Notice",
    "description": "Please agree to the copyright notice before submitting.",
    "type": "form", // APP\pages\submission\SubmissionHandler::SECTION_TYPE_CONFIRM
    "form": {
        ...
    }
}
```

The `review` type is a special type to show a review of the data. No configuration is needed, but if a section is added it will be displayed after the review.

```json
{
    "id": "review",
    "name": "Review",
    "description": "Please review this information before completing your submission.",
    "type": "review" // APP\pages\submission\SubmissionHandler::SECTION_TYPE_REVIEW
}
```

Other types can be created and added to the wizard by modifying the `wizard.tpl` template file or using the `Template::SubmissionWizard::Section` and `Template::SubmissionWizard::Section` hooks.

## Reconfigure Submission

Some submission properties like the language or section can only be changed through a special form. This appears at the top of the wizard, where it says something like "Submitting to the Articles section in English. These properties are changed separately from the rest of the wizard because they may effect the configuration of the wizard itself. Once the form is saved, the wizard is reloaded with the correct configuration for that section and language.

To map the values of this form to the correct API endpoint, you must set the `reconfigurePublicationProps` and `reconfigureSubmissionProps`. For example, the `sectionId` is a property of the `Publication`, but the `locale` is a property of the `Submission`. To ensure that each property is saved to the correct API endpoint, pass the following data to `<SubmissionWizardPage>`.

```json
{
    "reconfigurePublicationProps": ["sectionId"],
    "reconfigureSubmissionProps": ["locale"]
}
```

If more fields are added to the form, the properties must be added to these two props.
