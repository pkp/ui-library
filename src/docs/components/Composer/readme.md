## Props

| Key                          | Description                                                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `addCCLabel`                 | A localized string for the button to add CC/BCC recipients.                                                                                                                           |
| `attachers`                  | An array of `<FileAttacher>`s. See "File Attachments" below. Default: `[]`                                                                                                            |
| `attachments`                | An array of attached files. See "File Attachments" below. Default: `[]`                                                                                                               |
| `attachFilesLabel`           | A localized string for the button to attach files.                                                                                                                                    |
| `bcc`                        | A comma-separated list of email addresses for recipients that should be BCC'd in the email. Default: `''`                                                                             |
| `bccLabel`                   | A localized string for the BCC field.                                                                                                                                                 |
| `body`                       | The body of the email message. Default: `''`                                                                                                                                          |
| `bodyLabel`                  | A localized string for the body field.                                                                                                                                                |
| `canChangeRecipients`        | Can the user change the recipients? Default: `true`                                                                                                                                   |
| `cc`                         | A comma-separated list of email addresses for recipients that should be CC'd in the email.                                                                                            |
| `ccLabel`                    | A localized string for the CC field.                                                                                                                                                  |
| `confirmSwitchLocaleLabel`   | A localized string for the confirmation dialog that appears when a user wants to change the language.                                                                                 |
| `deselectLabel`              | A localized string for removing a recipient. |
| `emailTemplates`             | An array of `EmailTemplate`s that have been created for this message. Default: `[]`                                                                                                   |
| `emailTemplatesApiUrl`       | The URL to the API endpoint to get any `EmailTemplate`. When empty, no search field will be shown. Default: `''`                                                                      |
| `errors`                     | An object describing any errors with the form. See "Errors" below. Default: `{}`                                                                                                      |
| `findTemplateLabel`          | A localized string for the search field to find a template.                                                                                                                           |
| `id`                         | A unique id for this component. Two `<Composer>`s on the same page should not have the same `id`. Default: `composer`                                                                 |
| `initialTemplateKey`         | The key of an `EmailTemplate` to load automatically. If not present, the subject and body will be empty. Default: `''`                                                                |
| `insertLabel`                | A localized string for the button to insert content from a variable. |
| `insertModalLabel`           | A localized string for the modal to insert content from `variables`. |
| `insertContentLabel`         | A localized string for the list of `variables` that can be inserted. |
| `insertSearchLabel`          | A localized string for the search field when inserting content from `variables`. |
| `loadTemplateLabel`          | A localized string for the section where a user can load templates. |
| `locale`                     | The current locale code of the composer, such as `en` or `fr_CA`.                                                                                                                     |
| `locales`                    | An array of objects that specify the locales that can be used in this composer. Default: `[]`                                                                                         |
| `moreSearchResultsLabel`     | A localized string for the button to load more email template search results. Example: `{$number} more`                                                                               |
| `recipients`                 | An array of user ids of the recipients. Default: `[]`                                                                                                                                 |
| `recipientsLabel`            | A localized string for the recipients field. |
| `recipientOptions`           | An array of recipient options. See "Recipients" below.                                                                                                                                |
| `removeItemLabel`            | A localized string to remove an attachment. |
| `searchingLabel`             | A localized string shown when an email template search is in progress. |
| `searchResultsLabel`         | A localized string describing the email template search results. |
| `separateEmails`             | Whether or not each recipient should be sent a separate email. Set this to `true` when each recipient should not see the name and email address of other recipients. Default: `false` |
| `subject`                    | The subject of the email messsage. Default: `''`                                                                                                                                      |
| `subjectLabel`               | A localized string for the subject field.                                                                                                                                             |
| `switchToLabel`              | A localised string for the prompt to switch to another language. |
| `switchToNamedLanguageLabel` | A localized string for switching to another language. |
| `variables`                  | An object with prepared content for each locale. See "Insert Content" below. Default: `{}`                                                                                            |

## Events

| Key   | Description                                                                                                                |
| ----- | -------------------------------------------------------------------------------------------------------------------------- |
| `set` | Emitted whenever a prop needs to be changed. An object with one or more changed props. Example: `{subject: 'New Subject'}` |

## Usage

Use this component to let a user draft and send an email. The `<Composer>` should be used whenever a user is presented with an option to send an email, so that they have a consistent experience of sending emails. It will also help users build a common understanding of what features are available, such as loading email templates, attaching files, and inserting content.

At the moment, the `<Composer>` is only used in a few places. However, the plan is to adopt this component wherever emails are sent.

## Recipients

The `recipientOptions` prop expects to receive an array of all allowed recipients . This will consist of the recipient's user ID along with localized names for each recipient.

```json
[
    {
        "value": 2,
        "label": {
            "en": "Carlo Corino",
            "ar": "Carlo Corino",
        },
    },
    {
        "value": 3,
        "label": {
            "en": "Hisham Abdel Moneim",
            "ar": "هشام عبد المنعم",
        },
    }
]
```

The `<Composer>` will pass the recipients in the current `locale` using the format expected by [FieldAutosuggestPreset](#/component/Form/fields/FieldAutosuggestPreset).

## Insert Content

The email subject and body will replace variables like `{$recipientName}` in an email template with an appropriate value from the `variables` prop. Pass an object with an array of variables for each locale in the `locales` prop.

```json
{
    "en": [
        {
            "key": "contactName",
            "value": "Hisham Abdel Moneim",
            "description": "The name of the primary journal contact",
        },
        {
            "key": "contactEmail",
            "value": "hisham@example.org",
            "description": "The email of the primary journal contact",
        },
    ],
    "ar": [
        {
            "key": "contactName",
            "value": "هشام عبد المنعم",
            "description": "اسم جهة الاتصال الرئيسية في المجلة",
        },
        {
            "key": "contactEmail",
            "value": "hisham@example.org",
            "description": "عنوان البريد الالكتروني لجهة الاتصال الرئيسية في المجلة",
        },
    ]
}
```

## File Attachments

The [FileAttacher](#/component/FileAttacher) component is used to attach files to the `<Composer>`. When a file is attached, the `<Composer>` maps the file's `id` property to another property depending on which `<FileAttacher>` was used to attach it. This array is usually submitted with the form so that the correct file can be attached when the email is sent. A list of file attachments might look like the following.

```js
[
    // Attachments uploaded through FileAttacherUpload.
    {
        name: 'example.pdf',
        documentType: 'file-pdf-o',
        temporaryFileId: 73,
    },

    // Attachments selected from FileAttacherFileStage or FileAttacherReviewFiles
    {
        name: 'submission-file.docx',
        documentType: 'file-word-o',
        submissionFileId: 123,
    },

    // Attachments selected from FileAttacherLibrary
    {
        name: 'license-waiver.pdf',
        documentType: 'file-pdf-o',
        libraryFileId: 32,
    }
]
```

Learn more about how to configure the [FileAttacher](#/component/FileAttacher).

## Email Templates

Email templates are used widely throughout the applications. Wherever the `<Composer>` is used, managers should be able to configure more than one template through the manage emails interface in the editorial backend. Learn more about [email templates](https://docs.pkp.sfu.ca/dev/documentation/en/email-templates) on the server side.

## Errors

To display user input errors, pass an object with the errors as the `error` prop. Errors can be passed for the `bcc`, `cc`, `body`, `subject` and `attachments` fields.

```json
{
    "subject": ["This is not a valid subject"]
}
```