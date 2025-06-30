import User from '../models/User.js';

export const followUser = async (req, res) => {
  const userId = req.user.id;
  const targetId = req.params.userId;

  if (userId === targetId) return res.status(400).json({ message: "Cannot follow yourself" });

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) return res.status(404).json({ message: "User not found" });

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
    target.followers.push(userId);

    await user.save();
    await target.save();
  }

  res.status(200).json({ message: "Followed successfully" });
};

export const unfollowUser = async (req, res) => {
  const userId = req.user.id;
  const targetId = req.params.userId;

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!user || !target) return res.status(404).json({ message: "User not found" });

  user.following = user.following.filter(id => id.toString() !== targetId);
  target.followers = target.followers.filter(id => id.toString() !== userId);

  await user.save();
  await target.save();

  res.status(200).json({ message: "Unfollowed successfully" });
};

export const searchUsers = async (req, res) => {
  const username = (req.query.username || "").trim(); // ensure it's a string

  if (!username) {
    return res.status(400).json({ message: "Username query is required" });
  }

  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select("_id username email");

    res.status(200).json({ users });
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ message: "Server error while searching users" });
  }
};


export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  

  const user = await User.findById(userId)
    .select("-password")
    .populate("followers", "username")
    .populate("following", "username");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
};
