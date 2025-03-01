import { useEffect, useRef, useState } from "react";
// import { WebSocket} from "ws";
import "./App.css";

function App() {
	const [messages, setMessages] = useState(["hi there"]);
	const wsRef = useRef();
	const inputRef = useRef();


  useEffect(() => {
		const ws = new WebSocket("ws://localhost:8080");
		ws.onmessage = (event) => {
			setMessages((m) => [...m, event.data]);
		};
		//@ts-ignore
		wsRef.current = ws;

		ws.onopen = () => {
			ws.send(
				JSON.stringify({
					type: "join",
					payload: {
						roomId: "green",
					},
				})
			);
		};

		return () => {
			ws.close();
		};
	}, []);

  const joinroom=()=>{}
  // const joinroom=(color:string)=>{
  //   ws.send(
  //     JSON.stringify({
  //       type: "join",
  //       payload: {
  //         roomId: color,
  //       },
  //     })
  //   );
  // }

//   {
// 	"type":"chat",
// 	"payload":{
// 	  "message":"hello what are you doing"
// 	}
//   }

	return (
		<>
			<div className="h-screen bg-black flex flex-col">
				<div className="flex flex-row justify-between items-center gap-4 p-4 w-fit">
					<button onClick={()=>joinroom()} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300">
						Join Red
					</button>
					<button onClick={()=>joinroom()} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300">
						Join Green
					</button>
				</div>
				<div className="h-[95vh] my-10 mx-5 flex flex-col">
					{messages.map((message) => (
						<div className="flex flex-col gap-4 w-fit border-transparent">
							<span className="text-black my-3 p-3 border-transparent rounded-lg rounded-tl-none bg-white">
								{message}
							</span>
						</div>
					))}
				</div>
				<div className="flex flex-row">
					<input
						ref={inputRef}
						type="text"
						className="w-full p-3 rounded-md m-4"
					/>
					<button
						className= "m-4 p-3  bg-purple-800 text-white border-transparent rounded-md"
						onClick={() => {
							const message = inputRef.current?.value?.trim();
							wsRef.current.send(
								JSON.stringify({
									type: "chat",
									payload: {
										message: message,
									},
								})
							);
							inputRef.current.value = "";
						}}
					>
						Send
					</button>
				</div>
			</div>
		</>
	);
}

export default App;
