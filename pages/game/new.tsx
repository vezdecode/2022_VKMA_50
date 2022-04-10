import bridge, { UserGetFriendsFriend, UserInfo } from '@vkontakte/vk-bridge';
import { useRouter } from 'next/router';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import Button from '../../components/Button';
import { createGame } from '../../shared/api/game';
import { player } from '../../shared/types/game';
import LOCATIONS from '../../shared/consts/locations';

const CreateGamePage = (): JSX.Element => {
	const ref = useRef(null);
	const [myData, setMyData] = useState<UserGetFriendsFriend[]>();
	const [players, setPlayers] = useState<player[]>();
	const [user, setUser] = useState<UserInfo>();
	const { data, mutate } = useMutation(createGame);
	const router = useRouter();

	useEffect(() => {
		bridge
			.send('VKWebAppGetUserInfo')
			.then((data) => {
				setUser(data);
			});
	}, []);

	useEffect(() => {
		if (data) {
			(ref as any).current.style.opacity = 0;
			localStorage.setItem('current_game', JSON.stringify(data.id));
			
			setTimeout(() => {
				router.push('/game');
			}, 200);
		}
	});

	const addPlayers = () => {
		bridge
			.send('VKWebAppGetFriends', { multi: true })
			.then((data) => {
				setMyData(data.users);
			});
	};

	const createNewGame = () => {
		var _players = new Array(myData && myData.length + 1).fill({
			vk_id: 0,
			is_agent: false,
			is_admin: false,
		});

		setPlayers(JSON.parse(JSON.stringify(_players)));

		_players = players;

		user && _players && (_players[0] = {
			vk_id: user.id,
			is_agent: false,
			is_admin: true,
		});

		_players && myData.map((item, i) => {
			_players[i+1].vk_id = item.id;
		});
		
		_players && setPlayers(JSON.parse(JSON.stringify(_players)));	

		const agentID = _players && Math.floor(Math.random() * _players.length);
		_players && (_players[agentID].is_agent = true);
		
		var location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
		mutate({
			players: players,
			location: location,
		});
	};

	return(
		<div className='p-8 bg-white h-screen' ref={ref}>
			<h1 className='font-bold text-3xl'>
				Создание игры
			</h1>

			{myData ? (
				<div>
					<div className='grid grid-cols-2 md:grid-cols-3'>
						{myData.map((item, i) => (
							<p key={i} className='mt-4 font-semibold text-lg text-staticPrimary'>
								{item.first_name}
								{' '}
								{item.last_name}
							</p>
						))}
					</div>
					
					{players && (
						<h1 className='mt-8 text-xl font-semibold'>
							Эти друзья будут добавлены в игру. Вы уверены?
						</h1>
					)}

					<Button className='w-full md:w-1/2 xl:w-1/3 mt-8' onClick={() => createNewGame()}>
						{players ? 'Уверен!' : 'Начать'}
					</Button>
				</div>
			) : (
				<Button className='w-full md:w-1/2 xl:w-1/3 mt-8' onClick={() => addPlayers()}>
					Добавить игроков
				</Button>
			)}
			{data && (
				data.location
			)}
		</div>
	);
};

export default CreateGamePage;
