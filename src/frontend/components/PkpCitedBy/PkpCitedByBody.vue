<template>
	<div :class="cn('root')">
		<div>
			<h5 :class="cn('bodyCitationsCount')">
				{{
					t('plugins.generic.crossref.citedBy.citationCount', {
						count: store.total,
					})
				}}
			</h5>
		</div>

		<div :class="cn('citationsWrapper')">
			<ul :class="cn('citationsList')">
				<li
					v-for="(citation, index) in store.citations"
					:key="citation.doi"
					:class="cn('citationsListItem')"
				>
					<span :class="cn('citationsListItemIndex')">{{ index + 1 }}.</span>
					<div :class="cn('citationsListItemContent')">
						<span>
							<span v-if="citation?.authors" :class="cn('authors')">
								{{ citation?.authors }}
							</span>

							<span v-if="citation?.title" :class="cn('title')">
								{{ citation?.title }}
							</span>

							<span v-if="citation?.journal" :class="cn('journal')">
								{{ citation?.journal }}
							</span>

							<span
								v-if="citation?.institutionName"
								:class="cn('institutionName')"
							>
								{{ citation?.institutionName }}
							</span>

							<span v-if="citation?.doi" :class="cn('doi')">
								{{ citation.doi }}
							</span>

							<span v-if="citation?.year" :class="cn('year')">
								{{ citation.year }}
							</span>

							<span v-if="citation?.volume" :class="cn('volume')">
								<strong>{{ citation.volume }}</strong>
							</span>

							<span v-if="citation?.firstPage" :class="cn('firstPage')">
								{{ citation.firstPage }}
							</span>
						</span>
						<p>
							<a
								v-if="citation.doi"
								:href="store.getDoiExternalLink(citation.doi)"
								target="_blank"
								:class="cn('doiExternal')"
							>
								{{ store.getDoiExternalLink(citation.doi) }}
								<PkpIcon icon="OpenNewTab" :size="14" />
							</a>
						</p>
					</div>
				</li>
			</ul>
		</div>

		<div :class="cn('actions')">
			<PkpButton
				:is-disabled="store.isLoading || store.total < 1"
				@click="store.copyAllToClipboard()"
			>
				{{
					store.copiedToClipboard
						? t('common.copied')
						: t('plugins.generic.crossref.citedBy.copyCitationDetails')
				}}
			</PkpButton>

			<PkpButton :class="cn('actionsCloseBtn')" @click="onClose">
				{{ t('common.close') }}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import {usePkpCitedByStore} from './usePkpCitedByStore';
import {usePkpLocalize} from '@/frontend/composables/usePkpLocalize';
import PkpIcon from '@/frontend/components/PkpIcon/PkpIcon.vue';
import PkpButton from '@/frontend/components/PkpButton/PkpButton.vue';
import {usePkpStyles} from '@/frontend/composables/usePkpStyles.js';

const props = defineProps({
	styles: {type: Object, default: () => ({})},
	onClose: {type: Function, default: () => () => {}},
});

const {t} = usePkpLocalize();
const {cn} = usePkpStyles('PkpCitedByBody', props.styles);
const store = usePkpCitedByStore();
</script>
