import axios from 'axios';
import { ICreateGameRequest, IGetGameByID, IPutGameRequest } from '../types/game';

axios.defaults.baseURL = 'https://x8ki-letl-twmt.n7.xano.io/api:qcZEuHuQ';

const getGames = (): Promise<ICreateGameRequest[]> => {
	return axios.get('/game').then((res) => res.data);
};

const getGameByID = (data: IGetGameByID): Promise<ICreateGameRequest> => {
	return axios.get(`/game/${data.game_id}`).then((res) => res.data);
};

const createGame = (data: ICreateGameRequest): Promise<ICreateGameRequest> => {
	return axios.post('/game', {
		...data,
	}).then((res) => res.data);
};

const putGame = (data: IPutGameRequest): Promise<ICreateGameRequest> => {
	return axios.put(`/game/${data.game_id}`, data).then((res) => res.data);
};

export {
	getGames,
	getGameByID,
	createGame,
	putGame,
};
