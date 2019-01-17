
Use this component to display a short value in a badge which visually distinguishes it from the surrounding content.

## Usage Recommendations

This component is commonly used for tagging items as part of a group. This might include:

- a submission's stage
- a user's role
- whether a notification is new or read

It is also common to use a badge to display a count of something that is related to an item. Examples might include:

- the number of reviews a review is currently undertaking
- the number of submissions an editor has been assigned
- the number of notifications a user has

### Things to avoid

**Avoid using too many badges.** Badges should be used to bring attention to key information. If there are too many of them, it will cancel the effect.

**Avoid using badges for multiple things in the same space.** A badge works best when it visually links similar attributes of different objects together. Using badges for different kinds of attributes in the same space can make it difficult to determine what each value represents.

## Accessibility

A badge often relies on its visual proximity to indicate the meaning: a stage badge may appear beside a submission, a count of reviews beside a reviewer. When adding a badge, always include a `label` for those using a screen reader which fully describes it's meaning without requiring the information presented beside it.

```html
<!-- Example: a badge representing the submission's stage -->
<badge label="Currently in the review stage">
	{{ stage }}
</badge>
```
