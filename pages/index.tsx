import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import Button from '../components/Button';
import { getGames } from '../shared/api/game';
import LOCATIONS from '../shared/consts/locations';

const MainPage = (): JSX.Element => {
	const ref = useRef(null);
	const router = useRouter();
	const [user, setUser] = useState<UserInfo>();
	const { data } = useQuery('getgames', getGames);
	
	useEffect(() => {
		bridge
			.send('VKWebAppGetUserInfo')
			.then((data) => {
				setUser(data);
			});
	}, []);

	useEffect(() => {
		localStorage.clear();
	}, []);

	function routeToPage(page) {
		(ref as any).current.style.opacity = 0;

		setTimeout(() => {
			router.push(`/game${page}`);
		}, 200);
	}

	return(
		<div className='p-8 bg-white' ref={ref}>
			<h1 className='font-bold text-3xl'>
				Находка для шпиона онлайн / Локации
			</h1>
			<ul className='mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
				{LOCATIONS.map((item, i) => (
					<h2 
						key={i} 
						className={'font-semibold cursor-pointer w-3/4 '}
					>
						{item}
					</h2>
				))}
			</ul>
			
			<div className='w-full flex justify-center mt-8 gap-3'>
				<Button className='w-full md:w-1/2 xl:w-1/3' onClick={() => routeToPage('/new')}>
					Создать игру!
				</Button>

				<Button className='w-full md:w-1/2 xl:w-1/3' onClick={() => routeToPage('')}>
					Присоединиться
				</Button>
			</div>
		</div>
	);
};

export default MainPage;

export const getStaticProps: GetStaticProps = async () => {
	return {
		props: {},
	};
};
