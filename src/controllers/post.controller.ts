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
    const email = req.query.email; // Default to page 1 if not provided
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page if not provided

    // Calculate the number of items to skip based on page and pageSize
    const skip = (page - 1) * pageSize;

    const posts = await postClient.findMany({
      select: {
        id: true,
        body: true,
        image: true,
        createdDate: true,
        lastModifiedDate: true,
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
      ...(email && {
        where: { author: { email } },
      }),
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
    const isLoggedIn = await findSessionById(req, res);

    if (!isLoggedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const postId = req.params.id;
    const post = await postClient.findFirst({
      where: { id: postId },
      select: {
        author: {
          select: {
            email: true,
            name: true,
            profilePicture: true,
          },
        },
        body: true,
        comments: true,
        createdDate: true,
        id: true,
        image: true,
        lastModifiedDate: true,
      },
    });

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

export const deletePostById = async (req, res) => {
  try {
    const isLoggedIn = await findSessionById(req, res);

    if (!isLoggedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const postId = req.params.id;
    const post = await postClient.delete({
      where: { id: postId },
    });

    res.status(200).json({ data: "Success" });
  } catch (error) {
    console.log(error);
  }
};

export const putPostById = async (req, res) => {
  try {
    const isLoggedIn = await findSessionById(req, res);

    if (!isLoggedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const postId = req.params.id;

    const body = req.body.body;
    const image = req.body.image;

    await postClient.update({
      where: { id: postId },
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
