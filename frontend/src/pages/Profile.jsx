import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/api/users/${userId}`, {
          withCredentials: true,
        });
        setUser(res.data.user);

        const postRes = await axios.get(`/api/posts/user/${userId}`, {
          withCredentials: true,
        });
        setPosts(postRes.data);
      } catch (err) {
        console.error("Error loading profile or posts:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!user)
    return (
      <div className="text-center mt-10 text-gray-500 text-lg">Loading...</div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row gap-6 items-start border-b">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${user.username}&background=random`
            }
            className="w-28 h-28 rounded-full object-cover border-2 border-blue-500"
            alt="avatar"
          />
          <div>
            <h2 className="text-3xl font-bold text-blue-700">
              {user.username}
            </h2>
            <p className="text-gray-600 mt-1">{user.bio || "No bio provided."}</p>
            <p className="text-sm text-gray-400 mt-1">
              Joined: {new Date(user.createdAt).toLocaleDateString()}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mt-4 text-sm text-gray-700 font-medium">
              <span>👥 {user.followers?.length || 0} Followers</span>
              <span>➡️ {user.following?.length || 0} Following</span>
              <span>📝 {posts.length} Posts</span>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Posts</h3>

          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition"
                >
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      className="rounded-xl mb-3 w-full h-48 object-cover"
                    />
                  )}
                  <p className="text-gray-800">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
