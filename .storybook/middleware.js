const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function expressMiddleware(router) {
	router.use(
		'/index.php', // This is the API prefix that you want to proxy
		createProxyMiddleware({
			target: 'http://localhost:7003', // The backend server you want to proxy to
			changeOrigin: true,
		}),
	);
};
