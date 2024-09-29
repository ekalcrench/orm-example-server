import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { findSessionById } from "./session.controller";

const postClient = new PrismaClient().post;
const userClient = new PrismaClient().user;
const sessionClient = new PrismaClient().session;

export const getAllPosts = async (req, res) => {
  try {
    const isLoggedIn = await findSessionById(req, res);

    if (!isLoggedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get the page and pageSize from the request query params
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page if not provided

    // Calculate the number of items to skip based on page and pageSize
    const skip = (page - 1) * pageSize;

    const posts = await postClient.findMany({
      select: {
        id: true,
        body: true,
        image: true,
        author: {
          select: {
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });

    // Get the total count of posts (for calculating total pages)
    const totalData = await postClient.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalData / pageSize);

    res.status(200).json({
      data: posts,
      meta: {
        page,
        pageSize,
        totalData,
        totalPages,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postClient.findFirst({ where: { id: postId } });

    res.status(200).json({ data: post });
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (req, res) => {
  try {
    const isLoggedIn = await findSessionById(req, res);

    if (!isLoggedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const body = req.body.body;
    const image = req.body.image;

    await postClient.create({
      data: {
        body,
        image: image.length > 0 ? image : null,
        authorId: isLoggedIn.userId,
      },
    });

    res.status(200).json({ data: "Success" });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const sessionId = authHeader.split(" ")[1];
    if (!sessionId) return res.status(401).json({ message: "Token missing" });

    const session = await sessionClient.findFirst({ where: { id: sessionId } });
    if (!session) {
      return res.status(401).json({ message: "Authorization failed" });
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await userClient.update({
      data: { email, name, password: hashPassword },
      where: { id: session.userId },
    });

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};
