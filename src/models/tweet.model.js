import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
    {
        content:{
            type:String,
            required:true,
            maxLength:[280,"Tweet cannot exceed 280 characters"]
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
    },{timestamps:true}
)

export const Tweet = mongoose.model("Tweet",tweetSchema)