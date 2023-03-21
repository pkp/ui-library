## Data

This is a root component. Learn about [page hydration](#/pages/pages).

| Key | Description |
| --- | --- |
| `...` | All the data of [Page](#/component/Page). |
| `abandonDecisionLabel` | A localized string for the button to cancel recording a decision. |
| `cancelConfirmationPrompt` | A localized string for the confirmation prompt to cancel recording a decision. |
| `currentStep` | Tracks the currently open step. If not passed, the first step will be opened. Default: `{}` |
| `decision` | An integer representing the decision type. |
| `decisionCompleteLabel` | A localized string  when a decision has been recorded. See: `DecisionType::getCompletedLabel()` |
| `decisionCompleteDescription` | A localized string when a decision has been recorded. See: `DecisionType::getCompletedLabel()` |
| `emailTemplatesApiUrl` | A URL to the REST API to get email templates. |
| `isSubmitting` | Whether or not the decision is being recorded. Default: `false` |
| `keepWorkingLabel` | A localized string for the button to keep working in the confirmation prompt to cancel recording a decision. |
| `reviewRoundId` | The id of the review round this decision should be recorded in. Only pass a review round for decisions in the review stage. Default: `0` |
| `skippedSteps` | An array of steps that have been skipped. Default: `[]` |
| `stageId` | The id of the workflow stage this decision should be recorded in. One of the `WORKFLOW_STAGE_ID_*` constants. |
| `startedSteps` | An array of the steps that have been started. Default: `[]` |
| `steps` | An array of steps to record this decision. See usage guidance below. Default: `[]` |
| `submissionUrl` | The URL to the editorial workflow of the submission. |
| `submissionApiUrl` | The URL to the submission in the REST API. |
| `submissionListUrl` | The URL to the current user's submissions list. |
| `viewAllSubmissionsLabel` | A localized string for the button to view all submissions. |
| `viewSubmissionLabel` | A localized string for the button to view this submission. |

## Mixins

| Name | Description |
| --- | --- |
| `ajaxError` | Display an unexpected error in a dialog. |
| [dialog](#/mixins/dialog) | Show confirmation prompts. |
| `localizeSubmission` | Localize submission properties. |

## Usage

The `DecisionPage` extends the [`Page`](#/component/Page) component. This page controls the step-by-step workflow to record an editorial decision. Each step is defined in the `steps` array. Each step must be one of three recognized types: `form`, `email`, `promoteFiles`.

The `form` type will display a [Form](#/component/Form) as a step in the workflow. Pass the `<Form>` props in the `form` property.

```json
{
    "id": "payment",
    "type": "form",
    "name": "Request Payment",
    "description": "Ask the author to pay the Article Processing Charge (USD $150) now or waive the fee.",
    "errors": {},
    "form": {...formComponentProps},
}
```

The `email` type will display a [Composer](#/component/Composer) as a step in the workflow. Pass the `<Composer>` props alongside the step props.

```json
{
    "id": "notifyAuthors",
    "type": "email",
    "name": "Notify Authors",
    "description": "Send an email to the authors to let them know that their submission has been accepted for publication.",
    "errors": {},
    "to": [31],
    "recipientOptions": [...],
    "canChangeRecipients": false,
    "canSkip": true,
    "defaultEmailTemplateKey": "EDITOR_DECISION_ACCEPT",
    "emailTemplates": [...],
    "emailTemplatesApiUrl": "http://example.org",
    "variables": {...},
    "locale": "en",
    "locales": [...]
}
```

The `promoteFiles` type lets the user select one or more submission files to promote to a new file stage. Use a separate list for each file stage. Set the `to` property to the file stage which the selected files should be promoted to. Learn more about [Submission Files](https://docs.pkp.sfu.ca/dev/documentation/en/submission-files).

```json
{
    "id": "promoteFiles",
    "type": "promoteFiles",
    "name": "Select Files",
    "description": "Select files that should be sent to the copyediting stage.",
    "errors": {},
    "lists": [
        {
            "name": "Revisions",
            "files": [...submissionFiles],
        },
    ],
    "selected": [],
    "to": 6,
}
```

Helper classes to generate the step data from the server side can be found at `PKP\decision\steps`. To support new step types, edit the `submit()` method of `<DecisionPage>` and add a new conditional to the template like the following.

```html
<template v-else-if="step.type === 'your-new-type'">
```

