import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      const responseBody = await response.json();
      const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();

      expect(response.status).toBe(200);

      expect(responseBody.updated_at).toEqual(parsedUpdatedAt);
      expect(responseBody.dependencies.database.version).toEqual("17.5");
      expect(responseBody.dependencies.database.max_connections).toEqual(100);
      expect(responseBody.dependencies.database.current_connections).toEqual(1);
    });
    test("Current page status", async () => {
      const response = await fetch("http://localhost:3000/status");

      expect(response.status).toBe(200);
    });
  });
});
