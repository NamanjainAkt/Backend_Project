import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const filter = { isPublished: true }
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }
    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid user id")
        }
    }
    filter.createdBy = userId

    const sortOptions = {}
    if (sortBy) {
        sortOptions[sortBy] = sortType === "desc" ? -1 : 1
    }

    const videos = await Video.find(filter)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("createdBy")

    return res.status(200).json(new ApiResponse(200, "Videos fetched", videos))

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const userId = req.user._id
    if(!req.file){
        throw new ApiError(400, "Video file is required")
    }
    const result = await uploadOnCloudinary(req.file.path, "video")
    const newVideo = await Video.create({
        title,
        description,
        videoUrl: result.secure_url,
        createdBy: userId,
        isPublished: true
    })
    return res.status(201).json(new ApiResponse(201, "Video published", newVideo))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId).populate("createdBy")
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, "Video fetched", video))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {title, description} = req.body
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }   
    const video = await Video.findByIdAndUpdate(videoId, {title, description}, {new: true})
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, "Video updated", video))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findByIdAndDelete(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    return res.status(200).json(new ApiResponse(200, "Video deleted", null))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200, "Video publish status updated", video))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}