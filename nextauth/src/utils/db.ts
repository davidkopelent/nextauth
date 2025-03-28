'use server'

import prisma from "@/src/lib/prisma";

export async function getUserByEmail(email: string) {
    const user = await prisma.users.findUnique({
        where: { email },
        select: { id: true, email: true, firstname: true, lastname: true, password: true, provider: true }
    });
    return user;
}

export async function createUser(email: string, firstname: string, lastname: string, password: string, provider: string) {
    const user = await prisma.users.create({
        data: { email, firstname, lastname, password, provider }
    });
    return user;
}