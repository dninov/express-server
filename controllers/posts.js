import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPosts = async (req, res) => {
    console.log('GETTING POSTS');
    const { page } = req.query;

    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: posts, currentPage: Number(page), NumberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPostsBySearch = async (req, res) => {
    console.log('SEARCH POSTS');

    const { page, searchQuery, tags } = req.query;
    console.log(page, searchQuery, tags);
    let total = 0;
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    let posts = [];
    try {
        const title = new RegExp(searchQuery, 'i');
        if (searchQuery !== 'none' && tags.length === 0) {
            // posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
            const allPosts = await PostMessage.find({ title: title });
            total = allPosts.length;
            posts = await PostMessage.find({ title: title }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        }
        if (searchQuery === 'none' && tags.length > 0) {
            const allPosts = await PostMessage.find({ tags: { $in: tags.split(',') } });
            total = allPosts.length;
            posts = await PostMessage.find({ tags: { $in: tags.split(',') } }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        }
        if (searchQuery !== 'none' && tags.length > 0) {
            console.log('BOTH');
            const allPosts = await PostMessage.find({ title: title, tags: { $in: tags.split(',') } });
            console.log(allPosts.length);
            total = allPosts.length;
            posts = await PostMessage.find({ title: title, tags: { $in: tags.split(',') } }).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        }
        console.log(posts.length);
        res.status(200).json({ data: posts, currentPage: Number(page), NumberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });

    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: 'Post deleted successfully' });
};

export const likePost = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(req.userId);
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};

export const deletePosts = async (req, res) => {
    console.log('DELETING ALL POSTS');
    const id = req.params;
    if (!mongoose.Types.ObjectId.isValid(id.id)) return res.status(404).send('No user with that id');

    await PostMessage.deleteMany({ creator: id.id });

    res.json({ message: 'Posts deleted successfully' });
};
export const commentPost = async (req, res) => {
    console.log('COMMENT POSTS');
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    res.json(updatedPost);
};
