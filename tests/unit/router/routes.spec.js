import Vue from 'vue'
import router from "@/router"
import { beforeEach, isLoggedIn, canEdit } from "@/router"
import RESTClient from "@/components/Client/RESTClient.js"
const sinon = require("sinon");

describe("Routes", () => {
    it("routing variables are correctly set", () => {

        const beforeEachTester = [
            "User", "Edit profile", "New_content", "Edit Content"
        ];

        router.options.routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
            if (beforeEachTester.indexOf(route.name) > -1){
                const next = jest.fn();
                route.beforeEnter({path: {}}, undefined, next);
            }
            if (route.name === "*"){
                expect(route.redirect()).toStrictEqual({
                    name: "Error 404",
                    query: {source: "\"http://localhost/#/\""}
                })
            }
        });
    });

    it ("- NAVGUARD - redirect if the user is not logged in", () => {
        const store = {
          state: {
              users: {
                  user: function(){return {isLoggedIn: true}}
              }}
        };
        const next = jest.fn();
        isLoggedIn(undefined, undefined, next, store)
    });

    it ("- NAVGUARD - handles users rights to edit", async () => {
        Vue.config.productionTip = false;
        Vue.config.devtools = false;
        const store = {
            state: {
                users: {
                    user: function(){return {
                        isLoggedIn: true,
                        credentials: { token: 123 }
                    }}
                }}
        };
        const next = jest.fn();
        let restStub = sinon.stub(RESTClient.prototype, "executeQuery");
        restStub.returns({
            data: {id: 123}
        });
        await canEdit({params: {fromRecordPage: false}}, undefined, next, store);
        expect(next).toHaveBeenCalledWith();
        await canEdit({params: {fromRecordPage: true}}, undefined, next, store);
        expect(next).toHaveBeenCalledWith();

        restStub.restore();
        restStub = sinon.stub(RESTClient.prototype, "executeQuery");
        restStub.returns({
            data: {error: "Error!"}
        });
        await canEdit(
            {params: {fromRecordPage: false}},
            {params: {id: 123}},
            next,
            store);
        expect(next).toHaveBeenCalledWith({path: 123});
        store.state.record = {
            currentRecord: {
                fairsharingRecord: {
                    id: 123
                }
            }
        };
        await canEdit(
            {params: {fromRecordPage: false}, path: "123/edit"},
            {params: {id: null}},
            next,
            store);
        expect(next).toHaveBeenCalledWith({
            path: '/error/403',
            query: {source: '"123/edit"'}
        });

        restStub.restore();
        Vue.config.productionTip = true;
        Vue.config.devtools = true;
    });

    it("Can set a correct title", () => {
        let to = {
            meta: { title: "ABC" }
        };
        const next = jest.fn();
        beforeEach(to, undefined, next);
        expect(document.title).toMatch("FAIRsharing | ABC");

        to.meta = {};
        beforeEach(to, undefined, next);
        expect(document.title).toMatch("FAIRsharing");
    });

});
