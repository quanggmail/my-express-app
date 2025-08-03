const axios = require('axios');

const getPostById = async (postId) => {
    try {
        const res = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
        console.log(res.data);
        return res.data;
    } catch(e) {
        console.log('Error in getPostByID ',e.message);
    }
};
module.exports = {
    getPostById
};