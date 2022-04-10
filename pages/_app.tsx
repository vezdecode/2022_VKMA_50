import { AppProps } from 'next/app';
import bridge from '@vkontakte/vk-bridge';
import Head from 'next/head';

import '../styles/globals.css';
import '../styles/font.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
	const queryClient = new QueryClient();
	bridge.send('VKWebAppInit', {});

	return (
		<QueryClientProvider client={queryClient}>
			<Head>
				<title>
					VKMA40
				</title>
			</Head>
			<Component {...pageProps} />
		</QueryClientProvider>
	);
};

export default App;
