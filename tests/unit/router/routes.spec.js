import router from "@/router"
import { beforeEach, isLoggedIn } from "@/router"

let store = {
    state: {
        users: {
            user: function(){return {isLoggedIn: true}}
        }}
};

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
        });
    });
    it ("- NAVGUARD - redirect if the user is not logged in", async () => {
        const next = jest.fn();
        await isLoggedIn(undefined, undefined, next, store);
        expect(next).toHaveBeenCalled();
    });

    it("Can set a correct title", async () => {
        let to = {
            meta: { title: "ABC" }
        };
        const next = jest.fn();
        await beforeEach(to, undefined, next, store);
        expect(document.title).toMatch("FAIRsharing | ABC");

        to.meta = {};
        store = {
            state: {
                users: {
                    user: function(){return {isLoggedIn: false}}
                }}
        };
        await beforeEach(to, undefined, next, store);
        expect(document.title).toMatch("FAIRsharing");
    });

});
