import User from "./user.model.js";

export const createUser = async (req, res) => {
  console.log("req.body:", req.body)
  const user = await User.create({
    name: req.body.name,
  });
  res.json(user);
};

export const getAll = async (_, res) => {
  const users = await User.find();

  res.json(users);
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
