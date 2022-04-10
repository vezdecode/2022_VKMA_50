import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import Button from '../../components/Button';
import { getGameByID, getGames, putGame } from '../../shared/api/game';
import { player } from '../../shared/types/game';

const GamePage = (): JSX.Element => {
	const games = useQuery('getgames', getGames, {
		retry: 3,
	}); 
	const [agent, setAgent] = useState<player>();
	const [minutes, setMinutes] = useState<number>(-1);
	const [seconds, setSeconds] = useState<number>(-1);
	const { data, mutate } = useMutation('getGameById', getGameByID, {
		retry: 3,
		retryDelay: 3000,
	});
	const putMutation = useMutation('putGame', putGame);
	const [user, setUser] = useState<UserInfo>();

	useEffect(() => {
		if (data && !agent) 
			setAgent(data.players.find((player) => player.is_agent));
	});

	useEffect(() => {
		bridge
			.send('VKWebAppGetUserInfo')
			.then((data) => {
				setUser(data);
			});
	}, []);

	useEffect(() => {
		if (games.data){
			mutate({
				game_id: games.data[games.data.length-1].id,
			});
		}
	}, [games.data]);
	
	function getRole(){
		if(data && agent && data.is_started) {
			if (agent.vk_id === user.id) {
				return(
					<h2 className='text-2xl mt-8'>
						<span className='font-bold text-staticPrimary'>
							Ты шпион!
						</span>
						{' '} 
						Твоя задача не раскрыть себя. 
					</h2>
				);
			}
			else {
				return(
					<div>
						<h2 className='text-2xl mt-8'>
							Ты мирный житель, твоя задача максимально быстро раскрыть шпиона! Удачи :
							{')'}
						</h2>
						<h2 className='text-2xl mt-2 font-bold text-staticPrimary'>
							Локация:
							{' '}
							{data.location}
						</h2>
					</div>
				);
			};
		}
		else if (data && data.is_started) {
			return( 
				<h1 className='text-xl'>
					Загрузка...
				</h1>
			);
		}
	};

	const startGame = () => {
		if (data && games.data) {
			putMutation.mutate({
				game_id: games.data[games.data.length-1].id,
				players: data.players,
				is_started: true,
				location: data.location,
				timer: Date.now() + (data.players.length * 60000),
			});
			mutate({
				game_id: games.data[games.data.length-1].id,
			});
		}
	};

	useEffect(() => {
		if (data){
			var diff = data.timer - Date.now();
			const _minutes = diff > 0 ? Math.floor(diff / 1000 / 60) % 60 : 0;
			const _seconds = diff > 0 ? Math.floor(diff / 1000) % 60 : 0;

			minutes >= -1 && seconds >= -1 && setTimeout(() => {
				setMinutes(_minutes);
				setSeconds(_seconds);
			}, 1000);
		};
	});

	return(
		<div className='p-8'>
			<h1 className='font-bold text-3xl'>
				Находка для шпиона онлайн
			</h1>			
			
			{seconds > 0 && minutes > 0 && (
				<h1 className='text-xl'>
					До конца игры:
					{' '}
					{minutes}
					м
					{' '}
					{seconds}
					с
				</h1>
			)}

			{seconds === 0 && minutes === 0 && data && data.is_started && (
				<h1 className='text-2xl mt-2'>
					Игра закончена!
				</h1>
			)}

			{data && !data.is_started && (data.players[0].vk_id === user.id) && (
				<Button 	
					className='w-full md:w-1/2 xl:w-1/3 mt-8'
					onClick={() => {
						startGame();
					}}
				>
					Начать игру
				</Button>
			)}
			{data && !data.is_started && (data.players[0].vk_id != user.id) && (
				<div>
					<h2 className='text-2xl mt-8'>
						Дождись, пока админ начнет игру.
					</h2>
				</div>
			)}

			{getRole()}
		</div>
	);
};

export default GamePage;
