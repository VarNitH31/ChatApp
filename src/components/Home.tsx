import { useState } from "react";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

function Home() {
  const [isLogged, setIsLogged] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [joinRoomDis, setJoinRoomDis] = useState(false);
  const [createRoomDis, setCreateRoomDis] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username.trim() === "") {
      alert("Please enter a username");
      return;
    }
    setIsLogged(true);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUsername("");
    setJoinRoomDis(false);
    setCreateRoomDis(false);
  };

  const joinRoom = () => {
    if (roomId === "" || !isLogged) {
      alert(
        !isLogged
          ? "Please login first"
          : "Please enter a room ID to join"
      );
      return;
    }
    console.log(`Joining room: ${roomId}`);
    navigate(`/room/${roomId}/${username}`);
  };

  const createRoom = () => {
    if (roomId === "" || !isLogged) {
      alert(
        !isLogged
          ? "Please login first"
          : "Please enter a room ID to create"
      );
      return;
    }
    console.log(`Creating room: ${roomId}`);
    navigate(`/room/${roomId}/${username}`);
  };

  const toggleJoinRoom = () => {
    setJoinRoomDis(!joinRoomDis);
    setCreateRoomDis(false);
    setRoomId("");
  };

  const toggleCreateRoom = () => {
    setCreateRoomDis(!createRoomDis);
    setJoinRoomDis(false);
    setRoomId("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex justify-end m-3 bg-slate-700 p-5 rounded-md shadow-md">
        {!isLogged ? (
          <Button
            variant="positive"
            text={showLoginForm ? "Cancel" : "Login"}
            sizes="md"
            onClick={() => setShowLoginForm(!showLoginForm)}
          />
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-white">Welcome, {username}</span>
            <Button
              variant="negative"
              text="Logout"
              sizes="md"
              onClick={handleLogout}
            />
          </div>
        )}
      </nav>

      {/* Login Form */}
      {showLoginForm && !isLogged && (
        <div className="absolute top-20 right-3 bg-white p-4 rounded-md shadow-lg z-10 border border-gray-200">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Login</h3>
            <input
              type="text"
              placeholder="Enter your username"
              className="p-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              variant="positive"
              text="Confirm"
              sizes="md"
              onClick={handleLogin}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-grow justify-center items-center">
        <div className="flex w-full max-w-4xl justify-around items-center flex-wrap gap-8 px-4">
          {/* Join Room Section */}
          <div className="flex flex-col justify-center items-center gap-4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Join an Existing Room</h2>
            <Button
              variant="primary"
              text={joinRoomDis ? "Cancel" : "Join Room"}
              sizes="lg"
              onClick={toggleJoinRoom}
            />
            
            {joinRoomDis && (
              <div className="flex flex-col items-center gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  className="p-2 border rounded-md w-full"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Button
                  variant="positive"
                  text="Confirm Join"
                  sizes="md"
                  onClick={joinRoom}
                />
              </div>
            )}
          </div>

          {/* Create Room Section */}
          <div className="flex flex-col justify-center items-center gap-4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Create a New Room</h2>
            <Button
              variant="secondary"
              text={createRoomDis ? "Cancel" : "Create Room"}
              sizes="lg"
              onClick={toggleCreateRoom}
            />
            
            {createRoomDis && (
              <div className="flex flex-col items-center gap-3 mt-2">
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  className="p-2 border rounded-md w-full"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <Button
                  variant="positive"
                  text="Confirm Create"
                  sizes="md"
                  onClick={createRoom}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="p-4 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Room Chat Application
      </footer>
    </div>
  );
}

export default Home;