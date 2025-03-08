import { PrismaClient } from '@prisma/client';

export class PrismaService {
  private static instance: PrismaService | null = null;
  private prismaClient: PrismaClient;

  private constructor() {
    this.prismaClient = new PrismaClient();
  }

  // Singleton instance
  public static getInstance(): PrismaService {
    if (!this.instance) {
      this.instance = new PrismaService();
    }
    return this.instance;
  }

  // Provide access to the PrismaClient instance
  public get client(): PrismaClient {
    return this.prismaClient;
  }

  // Disconnect the PrismaClient
  public async disconnect(): Promise<void> {
    await this.prismaClient.$disconnect();
  }
}
