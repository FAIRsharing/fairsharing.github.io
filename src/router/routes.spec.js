import router from "./index"
import { beforeEach } from "./index"

describe("Routes", () => {
    it("routing variables are correctly set", () => {
        router.options.routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
        });
    })
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