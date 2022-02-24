## Props

| Key | Description |
| --- | --- |
| `bcc` | A comma-separated list of email addresses for recipients that should be BCC'd in the email. |
| `body` | The body of the email message. |
| `canChangeRecipients` | Can the recipients be modified? Default: `false` |
| `cc` | A comma-separated list of email addresses for recipients that should be CC'd in the email. |
| `emailTemplates` | An array of `emailTemplate`s appropriate for this message. |
| `emailTemplatesApiUrl` | The URL to the API endpoint to get `emailTemplate`s. |
| `subject` | The subject of the email messsage. |
| `to` | The recipients of this email. Expects an array of user IDs. |
| `variables` | An object containing key/value pairs to convert placeholders like `{$recipientName}` with the appropriate values. |

## Events

This is some text

## Usage

This is some text.