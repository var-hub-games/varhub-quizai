import {FC, useState} from "react";
import type {GameState} from "../../controllers";
import type {VarhubGameClient} from "../../types";
import {Divider} from "@nextui-org/react";
import {CardFooter} from "@nextui-org/card";
import {Button} from "@nextui-org/button";

interface QuizAnswerSectionProps {
	state: GameState
	client: VarhubGameClient
}

export const QuizAnswerSection: FC<QuizAnswerSectionProps> = ({state, client}) => {

	if (!state.currentQuiz?.answers) return null;

	const [answeredIndex, setAnsweredIndex] = useState(-1);

	const buttonsDisabled = state.phase !== "question" || state.answeredPlayers.indexOf(client.name) >= 0;

	const onClickAnswer = (i: number) => {
		setAnsweredIndex(i);
		client.methods.answer(i);
	}

	return (
		<>
			<Divider/>
			<CardFooter className="flex-row justify-around">
				{state.currentQuiz?.answers?.map((answer, i) => (
					<Button
						key={i}
						color={answeredIndex === i ? "secondary" : "primary"}
						isDisabled={buttonsDisabled}
						onClick={() => onClickAnswer(i)}
					>
						{state.correctAnswerIndex === i && (<i className="gg-check"></i>)} {answer}
					</Button>
				))}
			</CardFooter>
		</>
	)
}
