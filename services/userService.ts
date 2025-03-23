import prisma from '../utils/prismaClient';

export async function createUser(phoneNumber: string){
    let user = await prisma.user.create({
        data: {
            phoneNumber: phoneNumber
        }
    });

    return user;
}

export async function findUserByPhoneNumber(phoneNumber: string){
    let user = await prisma.user.findUnique({
        where: {
            phoneNumber: phoneNumber
        }
    });

    return user;
}