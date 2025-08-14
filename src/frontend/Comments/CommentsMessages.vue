<script>
import {h} from 'vue';
import CommentsMessageProvider from './CommentsMessageProvider.vue'; // Assume this is in the same directory or adjust path

export default {
	inheritAttrs: false, // Allows classes to apply to the root div
	setup(props, {slots, attrs}) {
		// Mock data for demonstration; in a real app, this could be a prop or fetched from an API/store
		const messages = [
			{
				id: 1,
				date: '2023-01-01',
				body: 'This is a great article!',
				author: {
					name: 'John Doe',
					orcid: '0000-0001-2345-6789',
					affiliation: 'University of Example',
				},
			},
			{
				id: 2,
				date: '2023-01-02',
				body: 'Interesting points raised here.',
				author: {
					name: 'Jane Smith',
					orcid: '0000-0002-3456-7890',
					affiliation: 'Research Institute',
				},
			},
		];

		return () => {
			if (!slots.default) {
				return h('div', {class: ['comments-messages', attrs.class]});
			}
			// Render the default slot multiple times, once per message, wrapped in MessageProvider
			return h(
				'div',
				{class: ['comments-messages', attrs.class]},
				messages.map((message) =>
					h(CommentsMessageProvider, {message}, () => slots.default()),
				),
			);
		};
	},
};
</script>
