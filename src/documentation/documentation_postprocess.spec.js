import myMod from './documentation_postprocess'

const
        fsMock = jest.fn({
            readdir: function (path) {
                path("abc")
            },
            readFile: function (path, data) {
                data(["a", "b", "cde"])
            }
        });

it("should return a string", () => {
    console.log(fsMock);
    myMod.test_function(fsMock);
});