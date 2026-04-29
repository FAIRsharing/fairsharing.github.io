import Client from "@/lib/Client/RESTClient.js";

const sinon = require("sinon");
describe("RESTClient", () => {
  let client;
  let dataStub = { data: "testData" };
  let stub;

  beforeEach(() => {
    stub = sinon.stub(Client.prototype, "executeQuery");
    stub.withArgs(sinon.match.any).returns(dataStub);
    client = new Client();
  });
  afterEach(() => {
    // Clean up after every test so they don't interfere
    stub.restore();
  });

  it("can be instantiated as a singleton", function () {
    const instance2 = new Client();
    expect(client).toBe(instance2.constructor["_instance"]);
  });

  it("can let user login", async () => {
    let resp = await client.login();
    expect(resp).toBe("testData");
  });

  it("can let users logout", async () => {
    let resp = await client.logout("thisisafaketoken");
    expect(resp).toBe("testData");
  });

  it("can let users create account", async () => {
    let resp = await client.createAccount("thisisalogin");
    expect(resp).toBe("testData");
  });

  it("can let users confirm their email", async () => {
    let resp = await client.confirmAccount("thisisaconfirmationtoken");
    expect(resp).toBe("testData");
  });

  it("can let users reset their password", async () => {
    let resp = await client.resetPassword("thisisjwtfaketoken");
    expect(resp).toBe("testData");
  });

  it("can let users re-send confirmation", async () => {
    let resp = await client.resendConfirmation({
      email: "example@fairsharing.org",
    });
    expect(resp).toBe("testData");
  });

  it("can get info about the user", async () => {
    let resp = await client.getUser("userToken");
    expect(resp).toBe("testData");
  });

  it("can get the list of available profile types", async () => {
    let resp = await client.getProfileTypes();
    expect(resp).toBe("testData");
  });

  it("can create a new user defined tag", async () => {
    let data = await client.createNewUserDefinedTag("abc", "def");
    expect(data).toBe("testData");
  });

  it("can create a new record", async () => {
    let data = await client.createRecord({}, "def");
    expect(data).toBe("testData");
  });

  it("can get the extra metadata fields", async () => {
    let resp = await client.extraMetadataFields(
      "model_and_format",
      "userToken",
    );
    expect(resp).toBe("testData");
  });

  it("can get a public user by ID", async () => {
    let resp = await client.getPublicUser("userToken", 1);
    expect(resp).toBe("testData");
  });

  it("can get a public users list", async () => {
    let resp = await client.getUsersList("userToken");
    expect(resp).toBe("testData");
  });

  it("can get a zenodo search information", async () => {
    let resp = await client.getZenodoSearch("doi_to_search", "userToken");
    expect(resp).toBe("testData");
  });

  it("can edit a user", async () => {
    let resp = await client.editUser({}, "userToken");
    expect(resp).toBe("testData");
  });

  it("can edit a public user", async () => {
    let resp = await client.editPublicUser({}, "userToken");
    expect(resp).toBe("testData");
  });

  it("can delete a public user", async () => {
    let resp = await client.deletePublicUser({}, "userToken");
    expect(resp).toBe("testData");
  });

  it("can delete a user's account", async () => {
    let resp = await client.delete("userToken");
    expect(resp).toBe("testData");
  });

  it("can sendOrcidVerification email", async () => {
    let user = {
      email: "example@fairsharing.org",
      identifier: "55324a98-4b8d-4d55-93a6-a37b55ce906c",
      uid: "0009-0009-7606-5584",
    };
    let resp = await client.sendOrcidVerification(user);
    expect(resp).toBe("testData");
  });

  it("can process network errors", async () => {
    stub.restore();
    vi.spyOn(console, "error");
    console.error.mockImplementation(() => {});
    let resp = await client.executeQuery({
      url: "http://test.com",
    });
    expect(resp.data.error).toBeTruthy();
    expect(typeof resp.data.error.message).toBe("string");
    console.error.mockRestore();
  });

  it("can changeWatcher method for a record", async () => {
    const recordID = 123;
    const operation = "watch";
    const userToken = "fake-user-token";
    let resp = await client.changeWatcher(recordID, operation, userToken);
    expect(resp).toBe("testData");
    const requestArgs = stub.lastCall.args[0];
    expect(requestArgs.method).toBe("post");
    expect(requestArgs.baseURL).toContain("/fairsharing_records/watch");
    expect(requestArgs.data).toEqual({
      record_id: recordID,
      operation: operation,
    });
    expect(requestArgs.headers).toBeDefined();
  });

  it("can createPublication method", async () => {
    const publicationData = {
      title: "Mapping the Genome",
      authors: "Jane Doe",
    };
    const userToken = "fake-token-456";
    let resp = await client.createPublication(publicationData, userToken);
    expect(resp).toBe("testData");

    // 2. Verify the request configuration passed to executeQuery
    const requestArgs = stub.lastCall.args[0];
    expect(requestArgs.method).toBe("post");
    expect(requestArgs.baseURL).toContain("/publications");
    expect(requestArgs.data).toEqual({
      publication: publicationData,
    });
    expect(requestArgs.headers).toBeDefined();
  });

  it("can editPublication method", async () => {
    const publicationData = {
      id: 1,
      title: "Mapping the Genome",
      authors: "Jane Doe",
    };
    const userToken = "fake-token-456";
    let resp = await client.editPublication(publicationData, userToken);
    expect(resp).toBe("testData");

    // 2. Verify the request configuration passed to executeQuery
    const requestArgs = stub.lastCall.args[0];
    expect(requestArgs.method).toBe("put");
    expect(requestArgs.baseURL).toContain("/publications/1");
    expect(requestArgs.data).toEqual({
      publication: publicationData,
    });
    expect(requestArgs.headers).toBeDefined();
  });

  it("can save relations when relations are provided", async () => {
    const options = {
      target: "123",
      token: "fake-token",
      relations: [{ id: 1, type: "related_to" }],
    };
    let resp = await client.saveRelations(options);
    expect(resp).toBe("testData");
    const requestArgs = stub.lastCall.args[0];
    expect(requestArgs.method).toBe("put");
    expect(requestArgs.baseURL).toContain("/fairsharing_records/123");
    expect(
      requestArgs.data.fairsharing_record.record_associations_attributes,
    ).toEqual(options.relations);
  });

  it("returns an empty object and does not execute query if relations are empty", async () => {
    const options = {
      target: "123",
      token: "fake-token",
      relations: [], // Empty array
    };

    // Reset stub tracking to make sure we know if it was called during this test
    stub.resetHistory();
    let resp = await client.saveRelations(options);
    //Verify it returns {} as per the "if" logic
    expect(resp).toEqual({});
    expect(stub.called).toBe(false);
  });
});
