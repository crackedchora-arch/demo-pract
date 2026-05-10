import User from "./user.model.js";

export const createUser = async (req, res) => {
  console.log("req.body:", req.body);
  const user = await User.create({
    name: req.body.name,
  });
  res.json(user);
};

export const getAll = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;
  const users = await User.find().skip(skip).limit(limit);

  const total = await User.countDocuments();

  res.json({
    users,
    hasMore: page * limit < total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
};

export const toggleActive = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.active = !user.active;

  await user.save();

  res.json(user);
};
