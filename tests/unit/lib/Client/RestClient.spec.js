import sinon from "sinon";

import Client from "@/lib/Client/RESTClient.js";

describe("RESTClient.js", function () {
  let restStub = sinon.stub(Client.prototype, "getUserRoles");

  restStub.returns([
    {
      id: 1,
      name: "user",
    },
  ]);

  afterAll(() => {
    restStub.restore();
  });

  // See the following PR for why this test is here:
  // https://github.com/FAIRsharing/fairsharing.github.io/pull/1552
  it("can get user roles", async () => {
    const client = new Client();
    let response = await client.getUserRoles("token");
    expect(response).toStrictEqual([{ id: 1, name: "user" }]);
  });

  it("can check clearLogo() method", async () => {
    const id = 13;
    const jwt = "mock-jwt-token";
    const mockResponse = {
      data: {
        fairsharing_record: {
          logo: {},
        },
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.clearLogo(id, jwt);
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "put",
      baseURL: "http://localhost:3000/fairsharing_records/13",
      headers: client.auth_headers(jwt),
      data: {
        fairsharing_record: {
          logo: {},
        },
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can get getStatisticsData", async () => {
    let restStub = sinon.stub(Client.prototype, "getStatisticsData");

    restStub.returns([
      {
        contributors: 1,
        resources: 2,
        views: 3,
      },
    ]);
    const client = new Client();
    let response = await client.getStatisticsData();
    expect(response).toStrictEqual([
      {
        contributors: 1,
        resources: 2,
        views: 3,
      },
    ]);
    restStub.restore();
  });

  it("can check removeMaintainer method", async () => {
    // 1. Setup mock data and stub
    const recordID = 42;
    const userToken = "test-token-123";
    const mockResponse = {
      data: { status: "success", message: "Maintainer removed" },
    };

    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";

    // 2. Execute the method
    const result = await client.removeMaintainer(recordID, userToken);

    // 3. Assertions
    // Check if the return value is the 'data' property of the response
    expect(result).toStrictEqual(mockResponse.data);

    // Verify executeQuery was called with the correct arguments
    expect(executeStub.calledOnce).toBe(true);

    const expectedRequest = {
      method: "post",
      baseURL: "http://localhost:3000/maintenance_requests/remove",
      headers: client.auth_headers(userToken),
      data: {
        maintenance_request: { fairsharing_record_id: recordID },
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check getStatisticsData() method", async () => {
    const mockResponse = {
      data: {
        email: "test@test.com",
        uid: "111111",
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.getStatisticsData();
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "get",
      baseURL: "http://localhost:3000/homepage_stats",
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check getHomepageJsonld() method", async () => {
    const mockResponse = {
      data: {
        email: "test@test.com",
        uid: "111111",
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.getHomepageJsonld();
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "get",
      baseURL: "http://localhost:3000/homepage_jsonld",
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check sendOrcidVerification() method", async () => {
    const user = {
      email: "test@test.com",
      uid: "111111",
    };

    const mockResponse = {
      data: {
        email: "test@test.com",
        uid: "111111",
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.sendOrcidVerification(user);
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "post",
      baseURL: "http://localhost:3000/users/auth/identify_user",
      headers: client.auth_headers(user),
      data: {
        user: user,
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check saveSearch() method", async () => {
    const saveSearchObj = {
      name: "Test Search",
      comments: "test query",
      user_ids: [1],
      url: "https://www.example.com",
    };
    const jwt = "mock-jwt-token";
    const mockResponse = {
      data: {
        name: "Test Search",
        comments: "test query",
        user_ids: [1],
        url: "https://www.example.com",
        creator_id: 1,
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.saveSearch(saveSearchObj, jwt);
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "post",
      baseURL: "http://localhost:3000/saved_searches",
      headers: client.auth_headers(jwt),
      data: {
        saved_search: saveSearchObj,
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check deleteSavedSearch() method", async () => {
    const saveSearchId = 13;
    const jwt = "mock-jwt-token";
    const mockResponse = {
      status: 204,
      statusText: "No Content",
    };

    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";

    const result = await client.deleteSavedSearch(saveSearchId, jwt);
    expect(executeStub.calledOnce).toBe(true);

    const expectedRequest = {
      method: "delete",
      baseURL: `http://localhost:3000/saved_searches/${saveSearchId}`,
      headers: client.auth_headers(jwt),
    };
    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check updateSaveSearch() method", async () => {
    const saveSearchId = 13;
    const saveSearchObj = {
      name: "Test Search",
      comments: "test query",
      user_ids: [1],
      url: "https://www.example.com",
    };
    const jwt = "mock-jwt-token";
    const mockResponse = {
      data: {
        name: "Test Search",
        comments: "test query",
        user_ids: [1],
        url: "https://www.example.com",
        creator_id: 1,
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.updateSaveSearch(
      saveSearchId,
      saveSearchObj,
      jwt,
    );
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "put",
      baseURL: "http://localhost:3000/saved_searches/13",
      headers: client.auth_headers(jwt),
      data: {
        saved_search: saveSearchObj,
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check createProcessingNotes() method", async () => {
    const noteText = "This is a test processing note";
    const recordId = 101;
    const jwt = "mock-jwt-token";
    const mockResponse = {
      data: {
        id: 5,
        note: noteText,
        fairsharing_record_id: recordId,
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.createProcessingNotes(noteText, recordId, jwt);
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "post",
      baseURL: "http://localhost:3000/processing_notes/",
      headers: client.auth_headers(jwt),
      data: {
        processing_note: {
          note: noteText,
          fairsharing_record_id: recordId,
        },
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);

    // 4. Cleanup
    executeStub.restore();
  });

  it("can check updateProcessingNotes() method", async () => {
    const noteId = 1;
    const noteText = "This is a test processing note";
    const recordId = 101;
    const jwt = "mock-jwt-token";
    const mockResponse = {
      data: {
        id: 5,
        note: noteText,
        fairsharing_record_id: recordId,
      },
    };
    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";
    const result = await client.updateProcessingNotes(
      noteId,
      noteText,
      recordId,
      jwt,
    );
    expect(result).toStrictEqual(mockResponse.data);
    expect(executeStub.calledOnce).toBe(true);
    const expectedRequest = {
      method: "put",
      baseURL: "http://localhost:3000/processing_notes/1",
      headers: client.auth_headers(jwt),
      data: {
        processing_note: {
          note: noteText,
          fairsharing_record_id: recordId,
        },
      },
    };

    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });

  it("can check deleteProcessingNote() method", async () => {
    const noteId = 505;
    const jwt = "mock-jwt-token";
    const mockResponse = {
      status: 204,
      statusText: "No Content",
    };

    const executeStub = sinon
      .stub(Client.prototype, "executeQuery")
      .resolves(mockResponse);

    const client = new Client();
    client.baseURL = "http://localhost:3000";

    const result = await client.deleteProcessingNote(noteId, jwt);
    expect(result).toStrictEqual(mockResponse);
    expect(executeStub.calledOnce).toBe(true);

    const expectedRequest = {
      method: "delete",
      baseURL: `http://localhost:3000/processing_notes/${noteId}`,
      headers: client.auth_headers(jwt),
    };
    expect(executeStub.firstCall.args[0]).toMatchObject(expectedRequest);
    executeStub.restore();
  });
});
