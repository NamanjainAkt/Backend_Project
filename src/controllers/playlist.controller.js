import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
    const userId = req.user._id
    const newPlaylist = await Playlist.create({name, description, createdBy: userId})
    return res.status(201).json(new ApiResponse(201, "Playlist created", newPlaylist))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }
    const playlists = await Playlist.find({createdBy: userId}).populate('videos')
    return res.status(200).json(new ApiResponse(200, "User playlists fetched", playlists))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId).populate('videos')
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, "Playlist fetched", playlist))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // Validate playlistId and videoId
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist or video id")
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    // Check if video already exists in playlist
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(409, "Video already in playlist")
    }

    // Add video to playlist
    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200).json(new ApiResponse(200, "Video added to playlist", playlist))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist or video id")
    }
    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId, videos: videoId },
        { $pull: { videos: videoId } },
        { new: true }
    )
    if(!playlist){
        throw new ApiError(404, "Playlist or video not found")
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, "Playlist deleted", null))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {name, description}, {new: true})
    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, "Playlist updated", playlist))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}