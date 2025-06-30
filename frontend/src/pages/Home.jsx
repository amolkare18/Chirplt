import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [followingIds, setFollowingIds] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/posts");
      setPosts(res.data.posts);
    } catch (err) {
      console.error("Error in fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/users/search?username=${searchTerm}`);
      setUsers(res.data.users);

      if (user && user.following) {
        setFollowingIds(user.following.map((f) => f._id));
      } else {
        const self = await axios.get("/users/me", { withCredentials: true });
        setFollowingIds(self.data.user.following.map((f) => f._id));
      }
    } catch (err) {
      console.error("Error in search:", err);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    try {
      const isFollowing = followingIds.includes(targetUserId);
      if (isFollowing) {
        await axios.post(`/users/${targetUserId}/unfollow`);
        setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
      } else {
        await axios.post(`/users/${targetUserId}/follow`);
        setFollowingIds((prev) => [...prev, targetUserId]);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/like`);
      fetchPosts();
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleDislike = async (postId) => {
    try {
      await axios.post(`/posts/${postId}/dislike`);
      fetchPosts();
    } catch (err) {
      console.error("Dislike failed:", err);
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;

    try {
      await axios.post(`/comments/${postId}`, { text }, { withCredentials: true });
      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
      fetchPosts();
    } catch (err) {
      console.error("Comment failed:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Feed */}
      <div className="md:col-span-3 space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="font-semibold text-blue-700 text-lg">
              {post.author.username}
            </div>

            <p className="my-3 text-gray-800">{post.content}</p>

            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-64 object-cover rounded-xl mb-3"
              />
            )}

            <div className="flex gap-4 text-sm text-gray-600 font-medium">
              <button
                onClick={() => handleLike(post._id)}
                className="hover:text-blue-600"
              >
                👍 Like ({post.likes.length})
              </button>
              <button
                onClick={() => handleDislike(post._id)}
                className="hover:text-red-500"
              >
                👎 Dislike ({post.dislikes.length})
              </button>
              <span>💬 Comments ({post.comments.length})</span>
            </div>

            {/* Comment Input */}
            <div className="mt-4">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Write a comment..."
                value={commentTexts[post._id] || ""}
                onChange={(e) =>
                  setCommentTexts((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && handleAddComment(post._id)
                }
              />
              <button
                onClick={() => handleAddComment(post._id)}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded-xl hover:bg-green-700 transition"
              >
                Post Comment
              </button>
            </div>

            {/* Comments */}
            <div className="mt-4 text-sm space-y-2 text-gray-700">
              {post.comments.map((comment, i) => (
                <div key={i} className="border-b pb-1">
                  <strong className="text-blue-700">{comment.author.username}:</strong>{" "}
                  {comment.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Search Sidebar */}
      <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-lg h-fit">
        <h3 className="text-xl font-bold mb-4 text-blue-700">Search Users 🔍</h3>

        <input
          type="text"
          className="w-full border border-gray-300 rounded-xl px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition mb-4"
        >
          Search
        </button>

        <ul className="space-y-3">
          {users.map((u) => (
            <li key={u._id} className="flex items-center justify-between">
              <Link
                to={`/profile/${u._id}`}
                className="text-blue-600 font-medium hover:underline"
              >
                {u.username}
              </Link>
              {u._id !== user?._id && (
                <button
                  onClick={() => handleFollowToggle(u._id)}
                  className={`text-xs px-3 py-1 rounded-xl font-semibold transition ${
                    followingIds.includes(u._id)
                      ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {followingIds.includes(u._id) ? "Following" : "Follow"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
