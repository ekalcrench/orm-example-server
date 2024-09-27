import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const sessionClient = new PrismaClient().session;
const userClient = new PrismaClient().user;

export const getSessionById = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const sessionId = authHeader.split(" ")[1];

    const session = await sessionClient.findFirst({ where: { id: sessionId } });

    res.status(200).json({ data: session });
  } catch (error) {
    console.log(error);
  }
};

export const createSession = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await userClient.findFirst({ where: { email } });
    console.log("user : ", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const reqPassword = req.body.password;

    const compare = await bcrypt.compare(reqPassword, user.password);
    console.log("compare : ", compare);

    if (!compare) {
      return res.status(404).json({ message: "Password wrong" });
    }

    const session = await sessionClient.create({
      data: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    console.log("session : ", session);

    res.status(200).json({ data: session });
  } catch (error) {
    console.log(error);
  }
};
