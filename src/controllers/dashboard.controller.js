import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelId} = req.params

    const totalVideos = await Video.countDocuments({owner: channelId})
    const totalSubscribers = await Subscription.countDocuments({channel: channelId})
    const totalLikes = await Like.countDocuments({videoOwner: channelId})

    const channelStats = {
        totalVideos,
        totalSubscribers,
        totalLikes
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channelStats, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelId} = req.params
    const {page = 1, limit = 10} = req.query

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Schema.Types.ObjectId(channelId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        }
    ])
    return res
       .status(200)
       .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }