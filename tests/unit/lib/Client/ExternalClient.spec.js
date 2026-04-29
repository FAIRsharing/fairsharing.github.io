import axios from "axios";

import Client from "@/lib/Client/ExternalClients.js";

const sinon = require("sinon");

describe("RESTClient", () => {
  let client;
  let dataStub = { data: "testData" };
  let RestStub;

  beforeAll(() => {
    client = new Client();
  });

  beforeEach(() => {
    RestStub = sinon.stub(axios, "get");
    RestStub.withArgs(sinon.match.any).returns(dataStub);
  });

  afterEach(() => {
    RestStub.restore();
  });

  it("can be instantiated as a singleton", function () {
    const instance2 = new Client();
    expect(client).toBe(instance2.constructor["_instance"]);
  });

  it("can execute a query", async () => {
    RestStub.restore();
    RestStub = sinon.stub(axios, "get");
    RestStub.rejects(new Error("Network Error"));
    let resp = await client.executeQuery({
      url: "http://google.com",
    });
    expect(resp.data.error).toBe("Network Error");
    expect(resp.data.isError).toBe(true);
  });

  it("throws error when response is HTML instead of JSON", async () => {
    // Simulate a successful request that returns a website
    RestStub.restore();
    RestStub = sinon.stub(axios, "get");
    RestStub.resolves({
      headers: { "content-type": "text/html" },
      data: "<html><body>Home Page</body></html>",
    });

    let resp = await client.executeQuery({ url: "http://osf.io/abc" });
    expect(resp.data.isError).toBe(true);
    expect(resp.data.error).toContain("Expected JSON but received HTML");
  });

  it("throws error when data is empty", async () => {
    RestStub.restore();
    RestStub = sinon.stub(axios, "get");
    RestStub.resolves({
      headers: { "content-type": "application/json" },
      data: null, // or [] or ""
    });

    let resp = await client.executeQuery({ url: "http://api.com/empty" });

    expect(resp.data.isError).toBe(true);
    expect(resp.data.error).toBe("No data returned from the source");
  });

  it("returns data on a successful JSON response", async () => {
    RestStub.restore();
    RestStub = sinon.stub(axios, "get");
    const mockData = { id: "123", name: "Test Data" };
    RestStub.resolves({
      headers: {
        "content-type": "application/json",
      },
      data: mockData,
    });

    let resp = await client.executeQuery({ url: "http://api.com/data" });

    // On success, your function returns the whole response object
    expect(resp.data).toEqual(mockData);
    expect(resp.data.isError).toBeUndefined();
  });

  it("getDOI returns data and sets Authorization header when user exists in localStorage", async () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ credentials: { token: "123" } }),
    );

    RestStub.restore();
    RestStub = sinon.stub(axios, "get");
    const mockData = { id: "zenodo-123", title: "Test Dataset" };
    RestStub.resolves({
      headers: { "content-type": "application/json" },
      data: mockData,
    });

    sinon.spy(client, "executeQuery");
    let resp = await client.getDOI("10.5281/zenodo.12345");
    expect(resp).toEqual(mockData);
    const requestArgs = client.executeQuery.firstCall.args[0];
    expect(requestArgs.headers.Authorization).toBe("Bearer 123");
    expect(requestArgs.headers.Accept).toBe("application/json");
    expect(requestArgs.url).toContain("zenodo?doi=10.5281%2Fzenodo.12345");
    client.executeQuery.restore();
    localStorage.clear();
  });

  it("getPMID returns data and calls the correct URL", async () => {
    RestStub.restore();
    RestStub = sinon.stub(axios, "get");
    const mockData = { pmid: "12345", title: "Medical Study" };
    RestStub.resolves({
      headers: { "content-type": "application/json" },
      data: mockData,
    });
    sinon.spy(client, "executeQuery");
    const testId = "12345";
    let resp = await client.getPMID(testId);
    expect(resp).toEqual(mockData);

    const requestArgs = client.executeQuery.firstCall.args[0];
    expect(requestArgs.url).toBe(client.pmidBaseURL + testId);
    expect(requestArgs.headers.Accept).toBe("application/json");
    client.executeQuery.restore();
  });
});
