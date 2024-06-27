const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function expressMiddleware(router) {
	if (process.env.STORYBOOK_APP_DOMAIN_URL) {
		router.use(
			'/index.php', // This is the API prefix that you want to proxy
			createProxyMiddleware({
				target: process.env.STORYBOOK_APP_DOMAIN_URL, // The backend server you want to proxy to
				changeOrigin: true,
				//pathRewrite: {
				//'^/index.php': '', // Rewrites the URL removing /api prefix before sending to the backend server
				//},
			}),
		);
	}
};
