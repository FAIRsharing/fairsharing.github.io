import {createLocalVue, shallowMount} from "@vue/test-utils"
import Client from "../../components/Client/Client.js"
const sinon = require("sinon");

describe("GraphQL Client", function(){

    it("can be instantiated as a singleton", function(){
       let instance1 = new Client();
       let instance2 = new Client();
       expect(instance1).toBe(instance2.constructor["_instance"]);
    });


});