import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const author = req.user.id; // from verifyAccessToken middleware
    const imageUrl = req.file ? req.file.path : "";

    const newPost = new Post({
      author,
      content,
      imageUrl,
    });

      await newPost.save();
     
      res.status(201).json(newPost);
      
  } catch (err) {
    res.status(500).json({ message: err.message +"error in creating msg" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    
    const posts = await Post.find()
      .populate("author", "username") // post author
      .sort({ createdAt: -1 }) // sort by creation date, most recent first
      .populate({
          path: "comments",
          populate: { path: "author", select: "username" }, // comment author
  });
      
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPostsByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.find({ author: userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts by user ID' });
  }
};



export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;

    // remove from dislikes if present
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId);

    if (post.likes.includes(userId)) {
      // unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;

    // remove from likes if present
    post.likes = post.likes.filter(id => id.toString() !== userId);

    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
    }

    await post.save();
    res.status(200).json({ dislikes: post.dislikes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

