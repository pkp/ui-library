function getRandomTitle(str) {
	let title = str
		.split(' ')
		.sort((a, b) => (Math.random() > 0.5 ? -1 : 1))
		.join(' ');
	return title.charAt(0).toUpperCase() + title.slice(1);
}

const baseTitle =
	'tortor ultrices dolor diam dignissim ante nulla et morbi imperdiet';
const sectionIds = [1, 2, 3];
const baseStat = {
	total: 0,
	abstractViews: 0,
	totalFileViews: 0,
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
		totalFileViews: Math.floor(Math.random() * 1000) + 1
	};

	let sixth = Math.floor(stat.totalFileViews / 6);
	stat.pdf = sixth * 3;
	stat.html = sixth * 2;
	stat.other = sixth * 1;
	stat.total = stat.abstractViews + stat.totalFileViews;

	stats.push(stat);
}

export default stats;
