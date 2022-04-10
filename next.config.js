module.exports = {
	reactStrictMode: true,
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			issuer: { and: [/\.(js|ts|md)x?$/] },
			use: ['@svgr/webpack'],
		});

		return config;
	},
	images: {
		domains: ['vk.com', 'sun3-9.userapi.com'],
	},
	experimental: {
		outputStandalone: true,
	},
};

