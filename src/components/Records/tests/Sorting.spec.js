import Sorting from "../Sorting";
import {shallowMount} from "@vue/test-utils";

let $route = {
    name: "Standards",
    query: {
        orderBy: 'name,asc',
    }
};

const $router = {
    push: jest.fn(),
};

describe("Sorting.vue", () => {
    // Set up the wrapper
    let wrapper;
    // let anotherWrapper;
    // let anotherWrapper2;
    beforeEach(() => {
        wrapper = shallowMount(Sorting, {
            mocks: {$route, $router},
        });
    });

    it('can check activateSortFilter', () => {
        let filterObject = {name: 'abbreviation', label: 'abbreviation', active: false}; // sortName name/best-match-etc
        wrapper.vm.activateSortFilters(filterObject);
        expect(wrapper.vm.sortingMethodStatus).toBe(true);
    });

    it('can check deActivateSortFilter', () => {
        wrapper.vm.deActiveSortFilters();
        expect(wrapper.vm.sortFilters).toStrictEqual([
            {name: 'name', label: 'name', active: false},
            {name: 'abbreviation', label: 'abbreviation', active: false},
            {name: '_score', label: 'best-match', active: false},
        ]);
        expect(wrapper.vm.sortingMethodStatus).toBe(false);
    });

    it('can check checkOrderByQueryExists', () => {
        const receivedObjectDefault = {fairsharingRegistry: 'Standard'};
        wrapper.vm.checkOrderByQueryExists(receivedObjectDefault);
        expect(wrapper.vm.sortFilters).toStrictEqual([
            {name: 'name', label: 'name', active: false},
            {name: 'abbreviation', label: 'abbreviation', active: false},
            {name: '_score', label: 'best-match', active: false},
        ]);

        const receivedObjectWithOrderBy = {fairsharingRegistry: 'Standard', orderBy: "name,desc"};
        wrapper.vm.checkOrderByQueryExists(receivedObjectWithOrderBy);
        expect(wrapper.vm.sortFilters[0]).toStrictEqual({name: 'name',label: 'name', active: true});

        const receivedObjectWithOrderByWithoutSortMethod = {fairsharingRegistry: 'Standard', orderBy: "name"};
        wrapper.vm.checkOrderByQueryExists(receivedObjectWithOrderByWithoutSortMethod);
        expect(wrapper.vm.$route.query).toStrictEqual({orderBy: 'name,asc'});

        const receivedObjectWithOrderBy2 = {fairsharingRegistry: 'Standard', orderBy: "_score,asc"};
        wrapper.vm.checkOrderByQueryExists(receivedObjectWithOrderBy2);
        expect(wrapper.vm.sortFilters[2]).toStrictEqual({name: '_score',label: 'best-match', active: true});

    });

    it('can check applySortQuery', async () => {
        await wrapper.vm.applySortQuery('name', 'desc');
        expect(wrapper.vm.$route.query.orderBy).toBe('name,asc');
    });

    it('can check checkOnceOrderByExists', () => {

        wrapper.vm.checkOnceOrderByExists({fairsharingRegistry: 'Standard'});
        expect(wrapper.vm.$route.query.orderBy).toBe('name,asc');


        wrapper.vm.checkOnceOrderByExists({fairsharingRegistry: 'Standard', orderBy: 'name,desc'});
        expect(wrapper.vm.toggleButtonText).toBe('asc');

        wrapper.vm.$route.query.orderBy = '_score,asc';
        wrapper.vm.checkOnceOrderByExists({fairsharingRegistry: 'Search', orderBy: '_score,asc'});
        expect(wrapper.vm.sortFilters[2]).toStrictEqual({name: '_score',label: 'best-match', active: true});

    });

    it('can check watcher', () => {
        wrapper.vm.toggleButtonText = ['name', 'desc'];
        let filterObject = {name: 'abbreviation', active: false}; // sortName name/best-match-etc
        wrapper.vm.changeActiveFilter(filterObject);

        wrapper.vm.$route.query = {orderBy: 'name,desc'};
        wrapper.vm.changeActiveFilter(filterObject)
    });

});