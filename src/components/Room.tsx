import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/Button";

interface Message {
	type: string;
	userName: string;
	message?: string;
	timestamp?: number;
}

const WS_SERVER = import.meta.env.VITE_WS_SERVER;



function Room() {
	const { roomId, userName } = useParams();
	const [messages, setMessages] = useState<Message[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const wsRef = useRef<WebSocket | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const navigate = useNavigate();

	const handleLeaveRoom = () => {
		if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
			wsRef.current.send(
				JSON.stringify({
					type: "leave",
					payload: {
						roomId: roomId,
						userName: userName,
					},
				})
			);
		}
		navigate(-1);
	};

	const handleSendMessage = () => {
		if (!inputRef.current || !wsRef.current) return;

		const message = inputRef.current.value.trim();
		if (!message) return;

		if (wsRef.current.readyState === WebSocket.OPEN) {
			wsRef.current.send(
				JSON.stringify({
					type: "chat",
					payload: {
						message: message,
						userName: userName,
						timestamp: Date.now(),
					},
				})
			);
			inputRef.current.value = "";
		} else {
			alert("Connection lost. Please refresh the page.");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}

	};

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		if (!roomId || !userName) {
			alert("Room ID or username is missing!");
			navigate("/");
			return;
		}

		// const ws = new WebSocket("ws://localhost:8080");
		const ws = new WebSocket(`ws://3.106.122.185:8080`);

		ws.onopen = () => {
			setIsConnected(true);
			ws.send(
				JSON.stringify({
					type: "join",
					payload: {
						roomId: roomId,
						userName: userName,
					},
				})
			);
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				console.log("Received message:", data);
				setMessages((prevMessages) => [...prevMessages, data]);
			} catch (error) {
				console.error("Error parsing message:", error);
			}
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
			setIsConnected(false);
		};

		ws.onclose = () => {
			console.log("WebSocket connection closed");
			setIsConnected(false);
		};

		wsRef.current = ws;

		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
		};
	}, [roomId, userName, navigate]);

	return (
		<div className="flex flex-col h-screen bg-gray-900">
			<nav className="w-full text-white p-4 bg-slate-800 shadow-md">
				<div className="flex justify-between items-center max-w-6xl mx-auto">
					<div className="flex items-center gap-3">
						<span className="font-semibold text-xl">Room: {roomId}</span>
						<span
							className={`inline-block w-3 h-3 rounded-full ${
								isConnected ? "bg-green-500" : "bg-red-500"
							}`}
						></span>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-gray-300">Logged in as: {userName}</span>
						<Button
							variant="negative"
							sizes="md"
							text="Leave Room"
							onClick={handleLeaveRoom}
						/>
					</div>
				</div>
			</nav>

			<div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
				<div className="max-w-4xl mx-auto space-y-4">
					{messages.map((data, index) => {
						if (data.type === "joined") {
							return (
								<div key={`join-${index}`} className="flex justify-center my-2">
									<span className="text-gray-400 text-sm bg-gray-800 px-3 py-1 rounded-full">
										{data.userName} joined the room
									</span>
								</div>
							);
						}

						const isCurrentUser = data.userName === userName;

						return (
							<div
								key={`msg-${index}`}
								className={`flex ${
									isCurrentUser ? "justify-end" : "justify-start"
								}`}
							>
								<div
									className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg ${
										isCurrentUser
											? "bg-blue-600 text-white rounded-tr-none"
											: "bg-white text-black rounded-tl-none"
									}`}
								>
									{!isCurrentUser && (
										<div className="px-3 pt-1 text-blue-500 text-xs font-medium">
											{data.userName}
										</div>
									)}
									<div className="px-3 py-2 break-words">{data.message}</div>
									<div
										className={`px-3 pb-1 text-xs text-right ${
											isCurrentUser ? "text-blue-200" : "text-gray-500"
										}`}
									>
										{data.timestamp
											? new Date(data.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit",
											  })
											: ""}
									</div>
								</div>
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
			</div>
			<div className="p-4 bg-gray-800 border-t border-gray-700">
				<div className="max-w-4xl mx-auto flex gap-2">
					<textarea
						ref={inputRef}
						placeholder="Type your message..."
						className="flex-grow p-3 h-fit rounded-l-md bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
						onKeyDown={handleKeyPress}
						rows={1}
						style={{ minHeight: "45px", maxHeight: "450px" }}
					/>
					<button
						className={`px-4 py-3 rounded-md font-medium focus:outline-none ${
							isConnected
								? "bg-blue-600 hover:bg-blue-700 text-white"
								: "bg-gray-500 text-gray-300 cursor-not-allowed"
						}`}
						onClick={handleSendMessage}
						disabled={!isConnected}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}

export default Room;
