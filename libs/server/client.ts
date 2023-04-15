import { PrismaClient } from "@prisma/client";

// declare global {
//   var client: PrismaClient | undefined;
// }

// const client = global.client || new PrismaClient();

// if (process.env.NODE_ENV === "development") global.client = client;

// export default client;


let client: PrismaClient | undefined

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    client = new PrismaClient();
  } else {
    let globalWithPrisma = global as typeof globalThis & {
      prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
      globalWithPrisma.prisma = new PrismaClient();
    }
    client = globalWithPrisma.prisma;
  }
}

export default client 