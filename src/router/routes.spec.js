import router from "./index"


describe("Routes", () => {
    it("routing variables are correctly set", () => {
        router.options.routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
        });
    })
});