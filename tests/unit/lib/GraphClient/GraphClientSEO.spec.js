import { beforeEach, describe, expect, it, vi } from "vitest";

import axios from "axios";
import GraphClientSEO from "@/lib/GraphClient/GraphClientSEO.js";

vi.mock("axios", () => ({
  default: vi.fn(),
}));

describe("GraphClientSEO", () => {
  let client;

  beforeEach(() => {
    GraphClientSEO._instance = undefined;
    process.env.VITE_API_ENDPOINT = "https://api.example.org/";
    process.env.VITE_CLIENT_ID = "client-id";
    axios.mockReset();
    client = new GraphClientSEO();
  });

  it("initializes headers, normalizes the endpoint, and remains a singleton", () => {
    expect(client.url).toBe("https://api.example.org/graphql");
    expect(client.headers["X-Client-Id"]).toBe("client-id");
    expect(new GraphClientSEO()).toBe(client);

    client.setHeader("token");
    expect(client.headers.Authorization).toBe("Bearer token");
  });

  it("omits the optional client ID header", () => {
    GraphClientSEO._instance = undefined;
    delete process.env.VITE_CLIENT_ID;

    const clientWithoutId = new GraphClientSEO();

    expect(clientWithoutId.headers).not.toHaveProperty("X-Client-Id");
  });

  it("builds parameters, fragments, and nested fields", () => {
    const query = {
      queryName: "records",
      queryParam: {
        active: true,
        page: 2,
        name: "Example",
        filter: '{status: "ready"}',
        ids: [1, "two"],
      },
      fields: [
        "id",
        { $ref: "keywords" },
        { $ref: "objectTypes" },
        {
          name: "owner",
          fields: ["name", { queryName: "profile", fields: ["id"] }],
        },
      ],
    };

    const output = client.buildQuery(query);

    expect(output).toContain("records(");
    expect(output).toContain("active:true");
    expect(output).toContain("page:2");
    expect(output).toContain('name:"Example"');
    expect(output).toContain('filter:{status: "ready"}');
    expect(output).toContain('ids:[1,"two"]');
    expect(output).toContain("owner{name profile{ id}}");
    expect(output).toContain("objectTypes{");
    expect(client.buildQuery({ queryName: "ping" })).toBe("ping");
  });

  it("posts queries and returns GraphQL data or errors", async () => {
    axios.mockResolvedValueOnce({ data: { data: { records: [1] } } });

    await expect(
      client.executeQuery({ queryName: "records", fields: ["id"] }),
    ).resolves.toEqual({ records: [1] });
    expect(axios).toHaveBeenCalledWith({
      method: "post",
      url: "https://api.example.org/graphql",
      data: { query: "{records{ id}}" },
      headers: client.headers,
    });

    axios.mockResolvedValueOnce({ data: { errors: [{ message: "bad query" }] } });
    await expect(client.executeQuery({ queryName: "broken" })).resolves.toEqual([
      { message: "bad query" },
    ]);
  });
});
