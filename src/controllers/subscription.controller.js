import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    const userId = req.user._id
    if(userId.toString() === channelId){
        throw new ApiError(400, "Cannot subscribe to yourself")
    }
    const channel = await User.findById(channelId)
    if(!channel){
        throw new ApiError(404, "Channel not found")
    }
    const existingSubscription = await Subscription.findOne({subscriber: userId, channel: channelId})
    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(new ApiResponse(200, "Unsubscribed from channel", null))
    }
    await Subscription.create({subscriber: userId, channel: channelId})
    return res.status(200).json(new ApiResponse(200, "Subscribed to channel", null))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id")
    }
    const subscribers = await Subscription.find({channel: channelId}).populate('subscriber')
    return res.status(200).json(new ApiResponse(200, "Channel subscribers fetched", subscribers))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid user id")
    }
    const subscribedChannels = await Subscription.find({subscriber: subscriberId}).populate('channel')
    return res.status(200).json(new ApiResponse(200, "User subscribed channels fetched", subscribedChannels))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}