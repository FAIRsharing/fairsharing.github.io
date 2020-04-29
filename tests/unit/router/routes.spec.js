import router from "../../../src/router"
import { beforeEach } from "../../../src/router"
import { isLoggedIn } from "@/router/index.js"

describe("Routes", () => {
    it("routing variables are correctly set", () => {
        router.options.routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
            if (route.name === "User"){
                const next = jest.fn();
                route.beforeEnter(undefined, undefined, next);
            }
            if (route.name === "Edit profile"){
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
