import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    const userId = req.user._id
    const newTweet = await Tweet.create({content, createdBy: userId})
    return res.status(201).json(new ApiResponse(201, "Tweet created", newTweet))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }
    const tweets = await Tweet.find({createdBy: userId}).populate('createdBy')
    return res.status(200).json(new ApiResponse(200, "User tweets fetched", tweets))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content} = req.body
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    const tweet = await Tweet.findByIdAndUpdate(tweetId, {content}, {new: true})
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    return res.status(200).json(new ApiResponse(200, "Tweet updated", tweet))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }
    const tweet = await Tweet.findByIdAndDelete(tweetId)
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }
    return res.status(200).json(new ApiResponse(200, "Tweet deleted", null))
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}