const socket = require("socket.io");
const crypto = require("crypto");
const { roundToNearestHours } = require("date-fns");
const { skipMiddlewareFunction } = require("mongoose");
const { Chat } = require("../models/chat");

const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId({ userId, targetUserId });
      console.log(firstName + "joined Room", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = await getSecretRoomId({ userId, targetUserId });
          console.log(firstName + " " + text);

          const connectionRequestExist = await ConnectionRequestModel.findOne({
            $or: [
              { fromUserId: userId, toUserId: targetUserId },
              { fromUserId: targetUserId, toUserId: userId },
            ],
            status: "Accepted",
          });

          // If they are not friends, don't allow message
          if (!connectionRequestExist) {
            return;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {}
      },
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
