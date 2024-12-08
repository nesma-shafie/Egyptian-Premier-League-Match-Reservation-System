// src/routes/authRouter.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");
const router = express.Router();

// Secret key for JWT (keep it safe)

// Signup Route
router.post("/signup", async (req, res) => {
  const {
    username,
    password,
    firstName,
    lastName,
    birthDate,
    gender,
    city,
    address,
    email,
  } = req.body;

  // Validate required fields
  if (
    !username ||
    !password ||
    !firstName ||
    !lastName ||
    !birthDate ||
    !gender ||
    !city ||
    !email
  ) {
    return res
      .status(400)
      .json({ message: "All fields except address are required" });
  }

  // Check if username or email already exists
  const userExists = await prisma.user.findFirst({
    where: {
      OR: [{ username: username }, { email: email }],
    },
  });

  if (userExists) {
    return res
      .status(400)
      .json({ message: "Username or email already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user in the database
  const newUser = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      firstName,
      birthDate: new Date(birthDate),
      lastName,
      gender,
      email,
      city,
      address,
    },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

  //   console.log("User created successfully: ", token);
  res.status(201).json({ message: "User created successfully", token });
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Find the user by username
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Compare the password with the hashed one
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });

  res.json({ message: "Login successful", token });
});

module.exports = router;
