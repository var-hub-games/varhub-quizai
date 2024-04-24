import {FC, useCallback, useEffect, useMemo, useState} from "react";
import type {VarhubGameClient} from "../../types";
import type {GameState} from "../../controllers";
import {QrCodeCanvas} from "../QrCodeCanvas";
import {Card, CardBody, CardHeader} from "@nextui-org/card";
import {Accordion, AccordionItem, Divider} from "@nextui-org/react";
import {QuizCardBody} from "./QuizCardBody";
import {QuizAnswerSection} from "./QuizAnswerSection";
import {Button} from "@nextui-org/button";
import {QuizGenerateBlock} from "./QuizGenerateBlock";

interface RoomProps {
	client: VarhubGameClient;
}


export const Room: FC<RoomProps> = (props) => {
	const {client} = props;

	const [gameState, setGameState] = useState<GameState|null>(null);

	const leave = useCallback(() => {
		history.replaceState({...history.state, join: false}, "");
		void client.close("leave");
	}, []);


	useEffect(() => {
		client.methods.getState().then(setGameState);
		client.messages.on("state", setGameState)

		return () => client.messages.off("state", setGameState);
	}, [client]);

	const inviteUrl = useMemo<string|null>(() => {
		const resultUrl = new URL(location.href);
		resultUrl.searchParams.set("url", client.hub.url);
		resultUrl.searchParams.set("room", client.roomId);
		return resultUrl.href;
	}, [client]);

	const share = useCallback(() => {
		void navigator.share({url: inviteUrl, title: "Join game", text: `Room id: ${client.roomId}`});
	}, [inviteUrl, client])

	if (!gameState) return <div>No game state</div>;

	return (
		<div className="flex flex-col">

			<Card>
				<CardHeader className="flex-col items-start">
					<p>Вопрос{gameState.currentSubject && ` на тему: ${gameState.currentSubject.toLowerCase()}`}</p>
					<small className="text-default-500">Текущее состояние: {gamePhaseNames[gameState.phase]}</small>
				</CardHeader>
				<Divider/>
				<QuizCardBody state={gameState}/>
				<QuizAnswerSection state={gameState} client={client}/>
				<QuizGenerateBlock state={gameState} client={client}/>
			</Card>

			<Card className="mt-8">
				<CardBody>
					<b>Таблица очков:</b>
					{Object.entries(gameState.scoreMap).map(([player, score]) => (
						<p>
							{player}: {score}
						</p>
					))}
				</CardBody>
			</Card>

			<div className="flex flex-col items-center mt-4">
				<QrCodeCanvas data={inviteUrl} onClick={share} />
				<p>Room: {client.roomId}</p>
			</div>


			<Button className="mt-4" color="danger" onClick={leave}>Quit</Button>


			<Card className="mt-8">
				<Accordion>
					<AccordionItem key="1" aria-label="JSON State" title="JSON State">
						{JSON.stringify(gameState)}
					</AccordionItem>
				</Accordion>
			</Card>
		</div>
	)
}

const gamePhaseNames: Record<GameState["phase"], string> = {
	question: "Ожидание ответов от игроков",
	idle: "Начало",
	pending: "Генерация вопроса",
	results: "Результаты",
	finish: "Конец игры"
}
