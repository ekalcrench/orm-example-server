import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { findSessionById } from "./session.controller";

const userClient = new PrismaClient().user;
const sessionClient = new PrismaClient().session;

export const getAllUsers = async (req, res) => {
  try {
    const user = await userClient.findMany();

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};

export const getUserData = async (req, res) => {
  try {
    const session = await findSessionById(req, res);

    if (!session) res.status(401).json({ message: "Unauthorized" });

    const user = await userClient.findFirst({ where: { id: session.userId } });

    res.status(200).json({ data: user });
  } catch (error) {
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    await userClient.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });

    res.status(200).json();
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
