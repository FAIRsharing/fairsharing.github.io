import {shallowMount} from "@vue/test-utils";
import RecordStatus from "@/components/Records/Shared/RecordStatus.vue"


describe("RecordStatus.vue", function () {
    let wrapper;

    wrapper = shallowMount(RecordStatus, {
        propsData: {record: {status: 'ready', type: 'collection'}}
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("RecordStatus");
    });

    it("can check either record state as props is passed or not ", () => {
        wrapper.setProps({record: {status: undefined, type: 'collection'}})
        expect(wrapper.vm.statusStyles[wrapper.vm.record.status]).toStrictEqual({
            title: '?',
            tooltip: 'Undefined',
            backColor: 'background: linear-gradient(red, red)'
        });

    });
});
