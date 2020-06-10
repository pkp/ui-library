## Props

| Key | Description |
| --- | --- |
| `...` | Supports all props in [FieldBase](#/component/Form/fields/FieldBase) except those related to multilingual input. A pub id is never multilingual. |
| `value` | The current value for this field. |
| `isPForPress` | Whether or not a `%p` in the `pattern` stands for the context initials or page numbers. This is used in OMP when generating a pub id. |
| `issueNumber` | The number of the issue this publication is assigned to. Used when generating a pub id. |
| `issueVolume` | The volume of the issue this publication is assigned to. Used when generating a pub id. |
| `pages` | The pages of this publication. Used when generating a pub id.
| `pattern` | The pattern to use when generating a pub id. This is configured in the pub id plugin settings. |
| `prefix` | The pub id prefix to use when generating a pub id. This is configured in the pub id plugin settings. |
| `publisherId` | The publisher id of this publication. Used when generating a pub id. |
| `separator` | An optional separator to be added between the pub id prefix and suffix when generating the pub id. |
| `submissionId` | The id of the submission for which a pub id will be generated. Used when generating a pub id. |
| `publicationId` | The id of the publication for which a pub id will be generated. Used when generating a pub id. |
| `year` | The year this publication was published. Will represent the issue's publication date if no `datePublished` exists for the publication. Used when generating a pub id. |

## Events

See [FieldBase](#/component/Form/fields/FieldBase).

## Usage

This component is a special field for setting a pub id, like a DOI, based on pre-configured settings in a pub id plugin. When the plugin settings permit a pub id to be customized directly, a [FieldText](./FieldText) should be used instead.
