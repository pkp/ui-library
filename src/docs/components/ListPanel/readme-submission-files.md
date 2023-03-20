
## Props

| Key | Description |
| --- | --- |
| `addFileLabel` | A localized string for the button to add a file. |
| `apiUrl` | The URL to upload files to. |
| `cancelUploadLabel` | A localized string for the button to cancel an upload while it is being uploaded. |
| `emptyLabel` | A localized string to show when there are no items in the list. |
| `emptyAddLabel` | A localized string for the button to upload a file when there are no items in the list. |
| `fileStage` | The file stage to upload the submission files to. See [Submission Files](https://docs.pkp.sfu.ca/dev/documentation/en/submission-files) |
| `form` | The [Form](#/component/Form) to select a file type. |
| `genrePromptLabel` | A localized string for the prompt to select a file type. |
| `genres` | An array of file types. See usage guidance below. |
| `id` | A unique id for this component. |
| `items` | An array of files uploaded or being uploaded. |
| `options` | Pass [options](https://www.dropzonejs.com/#configuration-options) to Dropzone.js. |
| `otherLabel` | A localized string to describe files types other than the primary file types. |
| `primaryLocale` | The primary locale for the submission files uploaded. This should match the submission's locale. |
| `removeConfirmLabel` | A localized string to for the confirmation modal to remove a file. |
| `stageId` | The workflow stage id to upload files to. One of the `WORKFLOW_STAGE_ID_*` constants. |
| `title` | The title of the list panel. |
| `uploadProgressLabel` | A localized string to show the upload progress. |

## Events

| Key | Description |
| --- | --- |
| `set` | Emitted when a prop should be changed. Payload: `(id, newProps)` |

## Mixins

This component does not use any mixins.

## Usage

Use this component to upload [Submission Files](https://docs.pkp.sfu.ca/dev/documentation/en/submission-files). Every submission file must be assigned a genre, one of the file types configured by the journal, press or preprint server. The `genre` prop expects an array of file type ids, names and whether or not the genre is one of the primary file types. See the following example.

```json
[
    {
        "id": 1,
        "name": "Book Manuscript",
        "isPrimary": true
    },
    {
        "id": 2,
        "name": "Preface"
    }
]
```
