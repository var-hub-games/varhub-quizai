import room from "varhub:room";
import config from "varhub:config"
import network from "varhub:api/network"


export interface Quiz {
	question: string;
	answers: Array<string>;
}

export type GameState = {
	currentQuiz: Quiz|null;

	scoreMap: Record<string, number>;
	answeredPlayers: Array<string>;
	correctAnswerIndex: number|null;
	phase: GamePhase;
	currentSubject?: string;
}

export type GamePhase =
	| "idle" // Preparing
	| "pending"
	| "question"
	| "results"
	| "finish"
;

let correctAnswerIndex = -1;
let currentAnswers: Record<string, number> = {};

let state: GameState = {
	currentQuiz: null,
	scoreMap: {},
	answeredPlayers: [],
	correctAnswerIndex: null,
	phase: "idle",
	config: config
} as any;

export function getConfig() {
	return config;
}

export function getState() {
	return state;
}

export function updateState() {
	room.broadcast("state", state);
}

const chatGptUrl = config["chatGptUrl"] as string;
async function requestChatGPTQuiz(subject: string = "случайная тема") {

	const request = {
		"modelName": "gpt-4",
		"nsfwBlock": false,
		"context": [
			{"role": "system", "message": "Ты помощник, который получает сообщение - тему, и формирует викторину на эту тему. Ответ нужно выдать в JSON в следующем формате: \"{question, answers, correctAnswerIndex}\""},
			{"role": "user", "message": subject}
		]
	}

	const response = await network.fetch(chatGptUrl, {
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify(request),
		method: "post",
		type: "json"
	});

	return JSON.parse(response.body.result[0].result.replace(/(```|\n)/g,"").replace("json{","{"));
}

export async function requestNewQuestion (subject?: string) {
	if (state.phase !== "idle" && state.phase !== "results") return;

	currentAnswers = {};
	state.answeredPlayers = [];
	state.correctAnswerIndex = null;
	state.currentQuiz = null;
	state.phase = "pending";
	state.currentSubject = subject
	updateState();
	const question = await requestChatGPTQuiz(subject);

	correctAnswerIndex = question.correctAnswerIndex;
	delete question["correctAnswerIndex"];
	state.currentQuiz = question;
	state.phase = "question";
	updateState();
}

function checkAllPlayersAnswered() {
	return room.getPlayers().every(it => state.answeredPlayers.indexOf(it) >= 0)
}

function updateScores() {
	for (let [player, answer] of Object.entries(currentAnswers)) {
		if (correctAnswerIndex === answer) state.scoreMap[player] = (state.scoreMap[player] || 0) + 1;
	}
}

export function answer(this: {player: string}, index: number) {
	if (state.phase !== "question") {
		throw new Error("You can only answer in question phase");
	}
	if (this.player in currentAnswers) {
		throw new Error("You can't answer again");
	}

	currentAnswers[this.player] = index;
	state.answeredPlayers.push(this.player);

	if (checkAllPlayersAnswered()) {
		state.phase = "results";
		state.correctAnswerIndex = correctAnswerIndex;
		updateScores();
	}

	updateState();
}
