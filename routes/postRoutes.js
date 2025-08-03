const express = require('express');
const router = express.Router();
const postService = require('../services/postService');

router.get('/:postId', async(req, res) => {
    const {postId} = req.params;
    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            return res.status(404).json({message : 'Can not find post'});
        }
        res.status(200).json(post);
    } catch (e) {
        res.status(500).json({message : 'Internal server error'});
    }



});
module.exports = router;