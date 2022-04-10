interface ICreateGameRequest {
	id?: number;
    created_at?: Date;
	players: player[];
	location: string;
	timer?: number;
	is_started?: boolean;
};

interface IGetGameByID {
	game_id: number;
};

interface IPutGameRequest {
	game_id: number;
	players: player[];
    location: string;
	timer: number;
	is_started: boolean;
}

type screens = 'common' | 'personal' | 'playing';

interface player {
	vk_id: number;
	is_agent: boolean;
	is_admin: boolean;
};

export type {
	screens,
	player,
	ICreateGameRequest,
	IGetGameByID,
	IPutGameRequest,
};
