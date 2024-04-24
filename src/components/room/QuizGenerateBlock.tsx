import {FC, useState} from "react";
import type {GameState} from "../../controllers";
import type {VarhubGameClient} from "../../types";
import {Divider, Input} from "@nextui-org/react";
import {CardFooter} from "@nextui-org/card";
import {Button} from "@nextui-org/button";

interface QuizGenerateBlockProps {
	state: GameState
	client: VarhubGameClient
}

export const QuizGenerateBlock: FC<QuizGenerateBlockProps> = ({state, client}) => {
	const [theme, setTheme] = useState("Случайная тема");

	if (state.phase !== "idle" && state.phase !== "results") return null;

	const onClickGenerate = () => {
		client.methods.requestNewQuestion(theme)
	}

	return (
		<>
			<Divider/>
			<CardFooter className="flex-col ">
				<p>Новый вопрос</p>
				<Input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ягоды / игры / знаменитости / ..."/>
				<Button
					onClick={onClickGenerate}
					color="secondary"
					className="mt-2"
				>
					Сгенерировать
				</Button>
			</CardFooter>
		</>
	)
}
