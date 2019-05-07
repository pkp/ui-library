function getRandomTitle(str) {
	let title = str
		.split(' ')
		.sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
		.join(' ');
	const trimLength = Math.floor(Math.random() * 20);
	title = title.charAt(0).toUpperCase() + title.slice(1);
	return title.substr(0, title.length - trimLength);
}

const baseTitle =
	'tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet';
const sectionIds = [1, 2, 3];
const baseStat = {
	total: 0,
	abstractViews: 0,
	galleyViews: 0,
	pdf: 0,
	html: 0,
	other: 0,
	object: {
		id: 1,
		fullTitle: {
			en_US: getRandomTitle(baseTitle)
		},
		sectionId: 1,
		authorString: 'Carlo Corino',
		urlPublished: '/example/1'
	}
};

let stats = [];
for (let i = 1; i < 61; i++) {
	let stat = {
		...baseStat,
		object: {
			...baseStat.object,
			id: i,
			fullTitle: {
				en_US: getRandomTitle(baseTitle)
			},
			sectionId: sectionIds[Math.floor(Math.random() * sectionIds.length)]
		},
		abstractViews: Math.floor(Math.random() * 10000) + 1,
		galleyViews: Math.floor(Math.random() * 1000) + 1
	};

	let sixth = Math.floor(stat.galleyViews / 6);
	stat.pdf = sixth * 3;
	stat.html = sixth * 2;
	stat.other = sixth * 1;
	stat.total = stat.abstractViews + stat.galleyViews;

	stats.push(stat);
}

export default stats;
