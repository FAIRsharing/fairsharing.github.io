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
    expect(resp.data.error.message).toBe("Network Error");
  });
});
