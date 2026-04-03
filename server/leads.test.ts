import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  insertLead: vi.fn().mockResolvedValue({ success: true }),
  getLeads: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("leads.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should accept a valid lead submission", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      nome: "João Silva",
      email: "joao@empresa.com",
      telefone: "(11) 99999-9999",
      empresa: "Empresa Teste",
      cargo: "CEO",
    });

    expect(result).toEqual({ success: true });
  });

  it("should accept a lead with only required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.submit({
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "11988887777",
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject a lead with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        nome: "Test",
        email: "invalid-email",
        telefone: "11999999999",
      })
    ).rejects.toThrow();
  });

  it("should reject a lead with short name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        nome: "A",
        email: "test@test.com",
        telefone: "11999999999",
      })
    ).rejects.toThrow();
  });

  it("should reject a lead with short phone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.leads.submit({
        nome: "Test User",
        email: "test@test.com",
        telefone: "123",
      })
    ).rejects.toThrow();
  });
});

describe("leads.list", () => {
  it("should require authentication", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.leads.list()).rejects.toThrow();
  });

  it("should return leads for authenticated users", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.leads.list();
    expect(Array.isArray(result)).toBe(true);
  });
});
