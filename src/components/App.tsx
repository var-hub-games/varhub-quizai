import React, { FC, useEffect, useState } from "react";
import {NextUIProvider} from "@nextui-org/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Enter } from "./Enter.jsx";
import { Room } from "./room/Room.jsx";
import { VarhubGameClient } from "../types";


export const App: FC = () => {
	const [client, setClient] = useState<VarhubGameClient|null>(null);

	useEffect(() => {
		// clear connection on close;
		if (!client) return;
		const onClose = () => setClient(null);
		client.on("close", onClose);
		return () => void client.off("close", onClose);
	}, [client]);


	return (
		<NextUIProvider>
			<NextThemesProvider attribute="class" defaultTheme="dark">
				{client ? (
					<Room client={client}  />
				) : (
					<Enter onCreate={setClient}/>
				)}
			</NextThemesProvider>
		</NextUIProvider>
	)
}
