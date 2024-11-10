import type { users } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { users } from "@prisma/client";

export async function getUserById(id: users["id"]) {
  const _id = id.toString();
  //should just be where : {id} // for some reason, id is being parsed as a string ...
  return prisma.users.findUnique({ where: { id: _id } });
}

export async function getUserByEmail(email: users["email"]) {
  return prisma.users.findUnique({ where: { email } });
}

export async function createUser(email: users["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.users.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
}

export async function deleteUserByEmail(email: users["email"]) {
  return prisma.users.delete({ where: { email } });
}

export async function verifyLogin(
  email: users["email"],
  password: users["password"],
) {
  const userWithPassword = await prisma.users.findUnique({
    where: { email },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, userWithPassword.password);

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
