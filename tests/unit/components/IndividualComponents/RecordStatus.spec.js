import {shallowMount} from "@vue/test-utils";
import RecordStatus from "@/components/IndividualComponents/RecordStatus.vue"


describe("RecordStatus.vue", function () {
    let wrapper;

    wrapper = shallowMount(RecordStatus, {
        propsData: {record: {status: 'ready'}}
    });


    it("can check either record state as props is passed or not ", () => {

        expect(wrapper.vm.statusStyles[wrapper.vm.record.status]).toStrictEqual({
            title: 'R',
            toolTip: 'Ready',
            backColor: 'background: linear-gradient(green, lightgreen)'
        });

        wrapper.setProps({record: {status:undefined}})
        expect(wrapper.vm.statusStyles[wrapper.vm.record.status]).toStrictEqual({
            title: '?',
            toolTip: 'undefined',
            backColor: 'background: linear-gradient(red, red)'
        });

    });
});


