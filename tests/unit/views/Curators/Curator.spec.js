import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";
import Curator from "@/views/Curators/Curator.vue"
import dataDahboard from "../../../fixtures/curationDashboardData.json"
import Vuetify from "vuetify"


const localVue = createLocalVue();
localVue.use(Vuex);
usersStore.state.user = function(){ return {
    isLoggedIn: true,
    credentials: {token: 123, username: 123}
}};
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});

const router = new VueRouter();
const $router = { push: jest.fn() };

let fakeDataDashboard =  dataDahboard;
let vuetify = new Vuetify();

describe("Curator.vue", () => {
  let wrapper;
  let restStub;
  let graphStub;

  beforeAll( async (done) => {
     restStub = sinon.stub(Client.prototype, "executeQuery").returns({
         data: {id: "12345", name: 123, token: 123}
     });

     graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns(fakeDataDashboard);

    wrapper = await shallowMount(Curator, {
        vuetify,
        localVue,
        router,
        mocks: {$store, $router}
    });
    done();
  });


  afterEach(() => {
      restStub.restore();
      graphStub.restore();
  });

  it("can be mounted", async () => {
      const title = "Curator";
      expect(wrapper.name()).toMatch(title);
      expect(wrapper.vm.approvalRequired.length).toBe(3);
      expect(wrapper.vm.approvalRequired[0].curator).toBe("Terazu");//Name reduced number to six characters
      expect(wrapper.vm.curatorList.length).toBe(4);//Added "none" in curatorList and not adding one that is "dev_curator"
      expect(wrapper.vm.curatorList[0].userName).toBe("Luther");//It is the super_curator
      expect(wrapper.vm.curatorList[1].userName).toBe("Mary the Great Curator");//it is the senior_curator
      expect(wrapper.vm.curatorList[2].userName).toBe("H. Pepa");//it is the curator
      expect(wrapper.vm.curatorList[3].userName).toBe("none");

      //MaintanceRequest are properly created, elements sorted by date, values edited and formatted properly
      expect(wrapper.vm.maintenanceRequests.length).toBe(4);
      expect(wrapper.vm.maintenanceRequests[0].userName).toBe("Mariano");
      let date = new Date("2020,8,27");
      let auxString = date.toLocaleString('default', { month: 'short' }) + ' ' +
          date.getDate() + ', ' + date.getFullYear();

      expect(wrapper.vm.maintenanceRequests[1].createdAt).toBe(auxString);
      //Records created last week, recordNameID is created and date is formatted
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek.length).toBe(3);
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek[1].recordNameID).toBe("Second (44)");
      date = new Date("2017,11,11");
      auxString = date.toLocaleString('default', { month: 'short' })+' '+date.getDate()+ ', '+date.getFullYear();
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek[2].createdAt).toBe(auxString);

      expect(wrapper.vm.recordsInCuration.length).toBe(2);
      expect(wrapper.vm.recordsInCuration[1].recordNameID).toBe("Frog French databases (12)");
      //Hidden records, date is formatted
      expect(wrapper.vm.hiddenRecords.length).toBe(2);
      date = new Date("1425,01,01");
      auxString = date.toLocaleString('default', { month: 'short' })+' '+date.getDate()+ ', '+date.getFullYear();
      expect(wrapper.vm.hiddenRecords[1].createdAt).toBe(auxString);
  });

  it("can download a file with records without DOIs", async () => {
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: "[El1|f1_1|f1_2|f1_3,El2|f2_1|f2_2|f2_3]"
    });
    await wrapper.vm.obtainFileRecordsWODois();
    expect(wrapper.vm.downloadContent).toBe("data:text/json;charset=utf-8,%5BEl1%7Cf1_1%7Cf1_2%7Cf1_3%0D%0AEl2%7Cf2_1%7Cf2_2%7Cf2_3%5D");
  });

  it("can process errors", async () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
          curationSummary: {error: "error"}
      });
      wrapper = await shallowMount(Curator, {
          localVue,
          router,
          mocks: {$store, $router}
      });
      expect(wrapper.vm.approvalRequired.length).toBe(0);
      expect(wrapper.vm.hiddenRecords.length).toBe(0);
  });

});
