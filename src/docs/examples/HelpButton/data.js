import HelpButton from '@/components/HelpButton/HelpButton.vue';
import ViewHelpButton from './ViewHelpButton.vue';

export default {
	viewComponent: ViewHelpButton,
	baseComponent: HelpButton,
	propDescription: {
		topic: 'Which topic to open in the help panel.',
		label: 'A localized label for screen readers. In English this should be "Help".',
	},
};
