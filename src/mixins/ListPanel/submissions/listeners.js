/**
 * Global event listeners for SubmissionsListPanels
 *
 * These listeners should be mixed in to every submissions list and will ensure
 * the lists are  updated when global events are fired which might effect the
 * list items.
 *
 * @see https://vuejs.org/v2/guide/mixins.html
 */
export default {
	mounted: function () {
		// Store a reference to this component for global event callbacks
		var self = this;

		// Refresh the list when a submission is updated in any way
		pkp.eventBus.$on('submissionUpdated', function (data) {
			self.get();
		});

		// Remove a submission from the list when it is deleted
		pkp.eventBus.$on('submissionDeleted', function (data) {
			if (!_.has(data, 'id') || !_.findWhere(self.collection.items, data)) {
				return;
			}
			self.collection.items = _.reject(self.collection.items, data);
			self.collection.maxItems--;
		});
	},
};
