import router from "../../../src/router"
import { beforeEach } from "../../../src/router"
import { isLoggedIn, _scrollBehaviour } from "@/router/index.js"

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
                route.beforeEnter(undefined, undefined, next);
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

    it("correctly detects page anchors", () => {
        _scrollBehaviour({hash: 'banana'}, undefined, undefined);

    });
});

describe("BeforeEach", () => {
   it("Can set a correct title", () =>{
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
