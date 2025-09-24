import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query
    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Schema.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
            },
        },
        {
            $unwind: "$owner",
        }
    ])

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        content,
        video: new mongoose.Schema.Types.ObjectId(videoId),
        owner: new mongoose.Schema.Types.ObjectId(req.user._id),
    })
    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding comment")
    }

    return res
        .status(201)
        .json(new ApiResponse(200, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findByIdAndUpdate(commentId, {
        content,
    })  

    if (!comment) {
        throw new ApiError(500, "Something went wrong while updating comment")
    }

    return res
       .status(200)
       .json(new ApiResponse(200, comment, "Comment updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params

    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(500, "Something went wrong while deleting comment")
    }

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}