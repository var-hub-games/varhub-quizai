import {FC} from "react";
import type {GameState} from "../../controllers";
import {Spinner} from "@nextui-org/react";
import {CardBody} from "@nextui-org/card";

interface QuizCardBodyProps {
	state: GameState
}

export const QuizCardBody: FC<QuizCardBodyProps> = ({state}) => {
	const phase = state.phase;

	if (phase === "question" || phase === "results") {
		return (
			<CardBody>
				<b>Вопрос</b>
				{state.currentQuiz.question}
			</CardBody>
		)
	}

	if (phase === "pending") {
		return (
			<CardBody>
				<Spinner/>
			</CardBody>
		)
	}

	return null;
}
