## Props

| Key | Description |
| --- | --- |
| `attachers` | An array of file attachers. See usage guidance below. |

## Events

| Key | Description |
| --- | --- |
| `attached:files` | Emitted when one or more files are attached using one of the `attachers`. Payload: `(attacher, files)` |

## Usage

Use the `<FileAttacher>` to allow a user to upload a file or select a file that has already been uploaded. Each one of the "attachers" configures a different source of files for the `<FileAttacher>`. For example, to allow the user to attach a file from the publisher library, the `attachers` prop would add a `FileAttacherLibrary`.

```html
<file-attacher
    :attachers="[
        {
            component: 'FileAttacherLibrary',
            label: 'Library Files',
            description: 'Attach files from the Submission and Publisher Libraries.',
            button: 'Attach Library Files',
            libraryApiUrl: 'http://example.org',
            includeSubmissionId: 15,
            attachSelectedLabel: 'Attach Selected',
            backLabel: 'Back',
            downloadLabel: 'Download'
        }
    ]"
/>
```

Add as many file attachers as appropriate for the use case. For example, if the component is used to send an email related to a submission, include a `FileAttacherFileStage` attacher with all of the relevant submission file stages.

The following file attachers are available.

| Component | Description |
| --- | --- |
| `FileAttacherUpload` | Upload one or more files to attach. Usually the temporary files API is used. |
| `FileAttacherReviewFiles` | Attach files that were uploaded by reviewers. |
| `FileAttacherFileStage` | Attach files uploaded during the submission workflow, such as revisions or files to be reviewed. Don't add a `FileAttacherFileStage` for each file stage. Use one `FileAttacaherFileStage` configured with multiple file stages. |
| `FileAttacherLibrary` | Attach files from the submission or publisher libraries. |

A PHP class is available at `PKP\components\fileAttachers` to generate the configuration data for each attacher on the server side.
