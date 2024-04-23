import {FC, useCallback, useEffect, useMemo, useState} from "react";
import type {VarhubGameClient} from "../../types";
import type {GameState} from "../../controllers";
import {QrCodeCanvas} from "../QrCodeCanvas";

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
		<div>
			{JSON.stringify(gameState)}
			<button onClick={() => client.methods.requestNewQuestion()}>Request new question</button>

			{gameState.phase === "question" && (
				<div>
					Answers:
					{gameState.currentQuiz?.answers?.map((answer, i) => (
						<div key={i}>
							<button onClick={() => client.methods.answer(i)}>{answer}</button>
						</div>
					))}
				</div>
			)}

			<div style={{marginTop: "40px"}}>
				<button onClick={leave}>Quit</button>
			</div>


			<QrCodeCanvas data={inviteUrl} onClick={share} />
			<div>
				{client.roomId}
			</div>
		</div>
	)
}
