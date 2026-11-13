/** Read OJS reference IDs, never their displayed bibliography numbers. */
export function citationReferenceIds(source) {
	try {
		const items = JSON.parse(decodeURIComponent(source || ''));
		return [...new Set(items.map((item) => String(item.id)))];
	} catch {
		return [];
	}
}

/**
 * Check if the metadata tracking generated citation digits is a valid citation marker. E.g.,
 * {
 *   version: 1,
 *   content: '[4, p. 5]',
 *   tokens: [
 *     {from: 1, to: 2, id: '34', text: '4'}
 *   ]
 * }
 * only 4 is generated, p. 5 is custom text.
 */
function isCitationMarker(marker) {
	return (
		marker?.version === 1 &&
		typeof marker.content === 'string' &&
		Array.isArray(marker.tokens) &&
		marker.tokens.every(
			(token, index) =>
				token &&
				typeof token.id === 'string' &&
				typeof token.text === 'string' &&
				Number.isInteger(token.from) &&
				Number.isInteger(token.to) &&
				token.from >= 0 &&
				token.to > token.from &&
				token.to <= marker.content.length &&
				(!index || token.from >= marker.tokens[index - 1].to) &&
				marker.content.slice(token.from, token.to) === token.text,
		)
	);
}

/**
 * Record which characters SciFlow generated. Only a complete generated ID
 * marker can start this record; custom text is never classified by its digits.
 */
export function generatedCitationMarker(node) {
	if (node.attrs.citationMode === 'custom') return false;
	const text = node.textContent;
	const match = text.match(/^\s*(\[|\()(\d+(?:\s*[,;]\s*\d+)*)(\]|\))\s*$/);
	if (!match || (match[1] === '[' ? match[3] !== ']' : match[3] !== ')'))
		return null;
	const ids = citationReferenceIds(node.attrs.source);
	const tokens = [...text.matchAll(/\d+/g)];
	if (
		tokens.length !== ids.length ||
		tokens.some((token, i) => token[0] !== ids[i])
	)
		return null;
	return {
		version: 1,
		content: text,
		tokens: tokens.map((token, i) => ({
			from: token.index,
			to: token.index + token[0].length,
			id: ids[i],
			text: token[0],
		})),
	};
}

/**
 * after editing a citation, keep tracking only the generated numbers left unchanged.
 * [4] → [4, p. 5]: keep tracking 4. The added p. 5 is author text.
 */
export function retainCitationMarker(marker, text) {
	if (!isCitationMarker(marker)) return false;
	if (marker.content === text) return marker;
	const before = marker.content;
	let from = 0;
	while (
		from < before.length &&
		from < text.length &&
		before[from] === text[from]
	)
		from++;
	let oldEnd = before.length;
	let newEnd = text.length;
	while (
		oldEnd > from &&
		newEnd > from &&
		before[oldEnd - 1] === text[newEnd - 1]
	) {
		oldEnd--;
		newEnd--;
	}
	const delta = newEnd - oldEnd;
	const tokens = marker.tokens
		.flatMap((token) => {
			if (token.to <= from) return [token];
			if (token.from >= oldEnd)
				return [{...token, from: token.from + delta, to: token.to + delta}];
			return [];
		})
		// Extending a generated number (for example, 4 to 45) replaces its
		// meaning. Do not renumber just the surviving digit inside the new number.
		.filter(
			(token) =>
				!/[0-9]/.test(text[token.from - 1] ?? '') &&
				!/[0-9]/.test(text[token.to] ?? ''),
		);
	return tokens.length ? {...marker, content: text, tokens} : false;
}

/** Changing the linked reference must also update the marker's identity. */
export function rebindCitationMarker(marker, beforeSource, afterSource) {
	if (!isCitationMarker(marker)) return marker;
	const before = citationReferenceIds(beforeSource);
	const after = citationReferenceIds(afterSource);
	if (before.length !== after.length) return false;
	const tokens = marker.tokens.map((token) => ({
		...token,
		id: after[before.indexOf(token.id)],
	}));
	return tokens.every((token) => token.id != null)
		? {...marker, tokens}
		: false;
}

/** Calculate replacements only for previously recorded generated characters. */
export function citationMarkerReplacements(marker, text, source, numbers) {
	if (!isCitationMarker(marker) || marker.content !== text) return [];
	const ids = citationReferenceIds(source);
	return marker.tokens.flatMap((token) => {
		const number = numbers.get(token.id);
		if (
			!ids.includes(token.id) ||
			!Number.isInteger(token.from) ||
			!Number.isInteger(token.to) ||
			token.from < 0 ||
			token.to <= token.from ||
			token.to > text.length ||
			text.slice(token.from, token.to) !== token.text ||
			number == null ||
			String(number) === token.text
		)
			return [];
		return [
			{start: token.from, end: token.to, text: String(number), id: token.id},
		];
	});
}

/** Refresh the recorded positions after bibliography numbers change length. */
export function replaceCitationMarker(marker, replacements) {
	if (!isCitationMarker(marker)) return false;
	let content = marker.content;
	for (const replacement of [...replacements].sort(
		(a, b) => b.start - a.start,
	)) {
		content =
			content.slice(0, replacement.start) +
			replacement.text +
			content.slice(replacement.end);
	}
	const tokens = marker.tokens.map((token) => {
		const replacement = replacements.find(
			(r) => r.start === token.from && r.end === token.to,
		);
		const shift = replacements
			.filter((r) => r.end <= token.from)
			.reduce((sum, r) => sum + r.text.length - (r.end - r.start), 0);
		const text = replacement?.text ?? token.text;
		return {
			...token,
			from: token.from + shift,
			to: token.from + shift + text.length,
			text,
		};
	});
	return {...marker, content, tokens};
}
