/**
 * HTML transformation specific to PDF only.
 *
 * Converts publication related metadata into a PDF-only header section,
 * which is prepended to the body HTML.
 *
 * @param {Object} context
 * @param {Object} context.publication The publication being converted.
 * @param {Object} context.submission The associated submission.
 * @param {Object} [context.issue] The issue assigned to this publication.
 * @param {string} [context.journalTitle] Journal title from the body text API.
 * @param {Function} context.localize Localize multilingual metadata values.
 * @param {Function} context.t Translate metadata labels.
 * @returns {string} PDF-only metadata HTML; empty when no metadata is available.
 */
export function renderPublicationPDFMetadata(context) {
	const doi = context.publication.doiObject?.doi?.trim();
	const heading = [
		renderTitle(context),
		renderAuthors(context),
		renderCitation(context),
		doi
			? `<p class="publication-pdf-doi"><strong>DOI:</strong> ${escapeHTML(doi)}</p>`
			: '',
	].join('');
	return [
		heading ? `<div class="publication-pdf-heading">${heading}</div>` : '',
		renderAbstract(context),
		renderKeywords(context),
	].join('');
}

function renderCitation({publication, journalTitle, issue, localize, t}) {
	const journal = journalTitle?.trim();
	const volume = issue?.showVolume && issue.volume;
	const number = issue?.showNumber && issue.number;
	const issueLabel = volume
		? `${t('issue.vol')} ${volume}${number ? `(${number})` : ''}`
		: number && `${t('issue.no')} ${number}`;
	const pages = publication.pages?.trim().replace(/(\d)\s*-\s*(?=\d)/g, '$1–');
	const parts = [
		journal && `<i>${escapeHTML(journal)}</i>`,
		issueLabel && escapeHTML(issueLabel),
		issue?.showTitle && escapeHTML(localize(issue.title) || ''),
		pages && `${escapeHTML(t('issue.pagesAbbreviated'))} ${escapeHTML(pages)}`,
		issue?.showYear && issue.year && escapeHTML(issue.year),
	].filter(Boolean);
	return parts.length
		? `<p class="publication-pdf-journal">${parts.join(', ')}</p>`
		: '';
}

function renderTitle({publication, localize}) {
	const title = localize(publication.fullTitle) || localize(publication.title);
	if (!title?.trim()) return '';
	return `<h1 class="publication-pdf-title">${escapeHTML(title)}</h1>`;
}

function renderAuthors({publication, localize, t}) {
	if (publication.hideAuthor) return '';
	return (publication.authors || [])
		.map((author) => {
			let name;
			if (author.contributorType === 'ANONYMOUS') {
				name = t('submission.submit.contributorType.anonymous');
			} else if (author.contributorType === 'ORGANIZATION') {
				name =
					localize(author.organizationName) ||
					author.organizationName?.[author.submissionLocale];
			} else {
				const locale = localize(author.givenName)
					? publication.locale
					: author.submissionLocale;
				name =
					localize(author.preferredPublicName) ||
					[author.givenName?.[locale], author.familyName?.[locale]]
						.filter(Boolean)
						.join(' ');
			}
			if (!name) return '';
			const affiliations = (author.affiliations || [])
				.map((affiliation) => localize(affiliation.name)?.trim())
				.filter(Boolean)
				.map(escapeHTML)
				.join('; ');
			return `<p class="publication-pdf-author"><strong>${escapeHTML(name)}</strong>${affiliations ? ` — <i>${affiliations}</i>` : ''}</p>`;
		})
		.join('');
}

function renderAbstract({publication, localize, t}) {
	const abstract = localize(publication.abstract);
	if (!abstract?.trim()) return '';
	// Abstracts contain rich text; the shared PDF pipeline sanitizes this HTML.
	return `<section class="publication-pdf-abstract"><h2>${escapeHTML(t('common.abstract'))}</h2>${abstract}</section>`;
}

function renderKeywords({publication, localize, t}) {
	const keywords = localize(publication.keywords);
	if (!Array.isArray(keywords)) return '';
	const names = keywords.map((keyword) => keyword.name?.trim()).filter(Boolean);
	if (!names.length) return '';
	return `<p class="publication-pdf-keywords"><strong>${escapeHTML(t('common.keywords'))}:</strong> ${names.map(escapeHTML).join('; ')}</p>`;
}

function escapeHTML(value) {
	return String(value).replace(
		/[&<>"']/g,
		(character) =>
			({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[
				character
			],
	);
}

/** Add publication metadata before the article text */
export function buildPDFContent(bodyHTML, metadataHTML = '') {
	if (!metadataHTML) return bodyHTML;
	return `<header class="publication-pdf-metadata">${metadataHTML}</header>${bodyHTML}`;
}
