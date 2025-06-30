import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;
    const userId = req.user.id;

    // console.log('text:', text, 'postId:', postId, 'userId:', userId);

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = new Comment({
      author: userId,
      postId,
      text,
    });

    const savedComment = await comment.save();

    // ✅ Now populate
    await savedComment.populate('author', 'username email');

    post.comments.push(savedComment._id);
    await post.save();

    // console.log("Comment saved and populated:", savedComment);

    res.status(201).json(savedComment);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};


export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate('author', 'username email') // Optional: populate user details
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
