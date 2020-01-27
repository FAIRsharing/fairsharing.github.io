import routes from "./routes.js"


describe("Routes", () => {
    it("routing variables are correctly set", () => {
        routes.forEach(function(route){
            if (route.name !== "Record"){
                expect(route.meta.title).toBe(route.name.replace(/_/g, " "))
            }
        });
    })
});