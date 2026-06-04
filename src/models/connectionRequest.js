const mongoose = require('mongoose');
const { Schema } = mongoose;


const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ["Interested", "Ignored",  "Accepted", "Rejected"],
            message: "{VALUE} is not supported"
        },
        required: true
    }

},
    {
        timestamps: true
    }
)

connectionRequestSchema.index({fromUserId: 1, toUserId:1});

connectionRequestSchema.pre("save", async function () {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
});



const ConnectionRequestModel = mongoose.model("connectionRequestModel", connectionRequestSchema);

module.exports = { ConnectionRequestModel }