import {actions, mutations} from "@/store/messages.js"
import MessagesData from '../../../tests/fixtures/getMessages.json'
import sinon from "sinon";
import GraphClient from "@/lib/GraphClient/GraphClient";

describe('Mutations & Actions', () => {

    const returnedVal = MessagesData;
    let state = {};
    let stub;
    actions.commit = jest.fn();

    beforeEach(() => {
       state = {
            loading: false,
            publicMessages:[],
        };
        stub = sinon.stub(GraphClient.prototype, "executeQuery");
        stub.returns(returnedVal);
    });
    afterEach(()=>{
        stub.restore();
    })

    it("can check the setGeneralUIAttributesAction action", () => {
        actions.setMessages();
        expect(actions.commit).toHaveBeenCalledTimes(1);
    });

    it("can check setPublicMessages mutations", () => {
        mutations.setMessages(state, {messages:[{message:'some text'}]});
        expect(state.publicMessages.messages.length).toBeGreaterThan(0)
    });

    it("can change the state of loading status", () => {
        mutations.setLoadingStatus(state, true);
        expect(state.isLoadingFilters).toBe(true);
    });

});
