import mongoose from "mongoose";

const messageSchema=new Schema({
    sender: {
        type: String, 
        required: true,
      },
      text: {
        type: String, 
        required: true,
      },
      roomId:{
        type:String,
        required:true,
      }
})

const Room=mongoose.model('Room',messageSchema);

export default Room;