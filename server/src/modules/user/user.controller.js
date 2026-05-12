import redis from "../../config/redis.js";
import User from "./user.model.js";

const root = "demo_pract";

export const createUser = async (req, res) => {
  const user = await User.create({
    name: req.body.name,
  });
  // delete old cache data
  const keys = await redis.keys(`${root}:users:*`);
  if (keys.length > 0) {
    redis.del(...keys);
  }

  res.json(user);
};

export const getAll = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  // redis cache key
  const cacheKey = `${root}:users:page:${page}:limit:${limit}`;
  // redis lock key
  const lockKey = `${root}:lock:${cacheKey}`;

  const cachedUsers = await redis.get(cacheKey);

  if (cachedUsers) {
    // console.log("Cache hitted");
    return res.json(cachedUsers);
  }

  // console.log("Cache missed");

  // lock aquire
  const lock = await redis.set(lockKey, "locked", {
    nx: true,
    ex: 5,
  });

  if (!lock) {
    // console.log("lock not aquired");

    // wait
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // retry cache entry
    const retryCache = await redis.get(cacheKey);

    if (retryCache) {
      return res.json(retryCache);
    }
  }

  // real db fetch
  try {
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    const responseData = {
      users: users,
      hasMore: page * limit < total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };

    await redis.set(cacheKey, responseData, {
      ex: 120,
    });

    // return res from db
    return res.json(responseData);
  } catch (error) {
    console.log("Error in getAll", error.message);
    return res.json({ message: "Server error" });
  } finally {
    // Release lock
    await redis.del(lockKey);
    // console.log("lock released")
  }
};

export const toggleActive = async (req, res) => {
  try {
    const userId = req.params.id;

    const lockKey = `${root}:lock:user:${req.params.id}`;

    const lock = await redis.set(lockKey, "locked", {
      nx: true,
      ex: 5,
    });

    if (!lock) {
      return res.status(429).json({
        message: "User is already being updated",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.active = !user.active;

    await user.save();

    const keys = await redis.keys(`${root}:users:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }

    res.json(user);
  } catch (error) {
    console.log("Error in toggleActive:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  } finally {
    // release lock
    await redis.del(`${root}:lock:user:${req.params.id}`);
  }
  
};
