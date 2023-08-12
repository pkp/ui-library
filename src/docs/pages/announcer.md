# Announcer

This library uses the [vue-announcer](https://github.com/vue-a11y/vue-announcer) plugin to inform someone who is using assistive technology that something on the screen has changed. For example, when a list of items has changed, the announcer should be used to say what has changed.

The `$announcer` can be used in any component.

```js
this.$announcer.set('Submission archived');
```

Use the `$announcer` whenever data has been removed and the UI is updated to reflect this.

```js
this.$announcer.set('Announcement deleted');
```

Use the `$announcer` whenever the UI changes visually and a user of assistive technology should be alerted.

```js
this.$announcer.set('Table sorted by date');
```

Use the `$announcer` when an action leads to a pending or loading state.

```js
this.$announcer.set('Loading submission details');
this.loadingComplete(() => {
    this.$announcer.set('Submission details loaded');
});
```

The `$announcer` is not needed in the following instances, because they already announce changes to assistive technology.

- The [&lt;Form&gt;](#/component/Form) components announce when they begin saving and when a save is completed.
- The [Notify](#/utilities/Notify) utility announces every notification.
- When a [&lt;Modal&gt;](#/component/Modal) or [dialog](#/mixins/dialog) is opened, no announcement is needed because the user's focus is moved into the popup, alerting them to the change.

## Localization

Don't forget to localize announcements.

```js
this.$announcer.set(this.__('common.loading'));
```

```js
this.$announcer.set(this.i18nLoaded);
```

## No actions allowed

Announced messages do not persist and may be overwritten quickly by other actions. For this reason, the user may not be able to interact with the announcement before it disappears. Never include a link, button, or other action in an announcement message.
