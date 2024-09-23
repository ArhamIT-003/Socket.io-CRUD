import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let crudData = [];
io.on("connection", (socket) => {
  socket.on("crud", (data) => {
    crudData.push(data);
  });

  socket.on("updating", (value) => {
    console.log(value);
    const index = crudData.findIndex((item) => item.id === value.id);
    console.log(index);
    if (index !== -1) {
      console.log(index);
      crudData[index] = { ...crudData[index], ...value };
      console.log("Data Updated", value);
    }
  });

  socket.on("delete", (value) => {
    console.log(value);
    const index = crudData.findIndex((item) => item.id === value.id);
    if (index !== -1) {
      crudData.splice(index, 1);
      console.log("Data Deleted", value);
    }
  });

  setInterval(() => {
    socket.emit("AllData", crudData);
  }, 1000);
});

httpServer.listen(8000, () => {
  console.log("Server running on port 8000");
});
