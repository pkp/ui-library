## Data

| Key | Description |
| --- | --- |
| `activityLogLabel` | Label for the activity log |
| `canAccessPublication` | Can the current user access the publication details? Default: `false` |
| `canEditPublication` | Can the current user edit the publication details? Default: `false` |
| `components` | Key/value map of nested components, such as forms. |
| `currentPublication` | The submission's current publication. |
| `editorialHistoryUrl` | URL to get the activity log modal. |
| `publicationFormIds` | Array containing all of the keys in `components` that match a publication form. These forms will be updated when changing versions.  |
| `publicationList` | Array containing the `id`, `datePublished`, `status` and `version` of every publication for this submission. |
| `publicationTabsLabel` | Label for the publication details tabs. |
| `publishLabel` | Label for the publish button. |
| `publishUrl` | URL to get the publish modal. |
| `representationsGridUrl` | URL to get the galley/publication formats grid. |
| `schedulePublicationLabel` | Label for the schedule for publication button. |
| `statusLabel` | Label for the working publication's current status. |
| `submission` | Object containing details about this submission. |
| `submissionApiUrl` | URL for the submissions REST API endpoint. |
| `submissionLibraryLabel` | Label for the submission library button. |
| `submissionLibraryUrl` | URL to get the submission library. |
| `supportsReferences` | Should the form for references be shown? |
| `unpublishConfirmLabel` | Confirmation message before unpublishing a publication. |
| `unpublishLabel` | Label for the unpublish button. |
| `unscheduleConfirmLabel` | Confirmation message before scheduling for publication. |
| `versionLabel` | Label for the current version. |
| `versionConfirmMessage` | Confirmation message before creating a new version. |
| `versionConfirmTitle` | Title of the confirmation modal before creating a new version. |
| `workingPublication` | Object representing the working publication. This is the version that is currently being shown. |

## Usage

The `WorkflowPage` extends the [`Container`](/#/pages/container) app. Use this app to show the submission workflow.

## Template

The `WorkflowPage` app is a template-less component. You must write the template in Smarty on the server-side and it will be compiled at run time.

The example here provides a sample template.
