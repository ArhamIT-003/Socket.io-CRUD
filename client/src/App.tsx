import { useEffect, useState } from "react";
import "./App.css";
import Input from "./components/input";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
function App() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
  });

  const [edit, setEdit] = useState(false);

  const [value, setValue] = useState([]);

  const socket = io("http://localhost:8000");

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const currentObj = { [name]: value };

    setFormData((prev) => ({ ...prev, ...currentObj }));
  };

  function connectSocket() {
    socket.on("connect", () => {
      console.log(socket.id);
    });
  }

  function getData() {
    socket.on("AllData", (data) => {
      console.log(data);
      setValue(data);
    });
  }

  function onSubmitHandler() {
    socket.emit("crud", { ...formData, id: uuidv4() });
    setFormData({
      id: "",
      email: "",
      name: "",
      password: "",
    });
    getData();
  }

  function updateHandler(data: {
    id: string;
    name: string;
    email: string;
    password: string;
  }) {
    setFormData(data);
    getData();
    setEdit(true);
  }

  function handleEdit() {
    socket.emit("updating", formData);
    setFormData({
      id: "",
      email: "",
      name: "",
      password: "",
    });
    setEdit(false);
  }

  function deleteHandler(data: { id: string }) {
    socket.emit("delete", data);
    console.log("deelete");
  }

  useEffect(() => {
    connectSocket();
    getData();
  }, []);

  return (
    <div className="container">
      <div className="wrapper">
        <Input
          type="text"
          name="name"
          placeholder="name"
          onChangeHandler={onChangeHandler}
          value={formData.name}
        />
        <Input
          type="email"
          name="email"
          placeholder="email"
          onChangeHandler={onChangeHandler}
          value={formData.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="password"
          onChangeHandler={onChangeHandler}
          value={formData.password}
        />

        {edit ? (
          <button className="btn" onClick={handleEdit}>
            Update
          </button>
        ) : (
          <button className="btn" onClick={onSubmitHandler}>
            Submit
          </button>
        )}
      </div>

      {value.length > 0 && (
        <div className="output-container">
          {value.map(
            (data: {
              id: string;
              name: string;
              email: string;
              password: string;
            }) => (
              <div key={data.id}>
                <p className="output">{data.name}</p>
                <p className="output">{data.email}</p>
                <p className="output">{data.password}</p>
                <div>
                  <button className="btn" onClick={() => updateHandler(data)}>
                    Update
                  </button>
                  <button className="btn" onClick={() => deleteHandler(data)}>
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default App;
