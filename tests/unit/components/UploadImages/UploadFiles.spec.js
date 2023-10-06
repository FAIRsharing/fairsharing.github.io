import {createLocalVue, shallowMount} from "@vue/test-utils";
import UploadFiles from "@/components/UploadFiles/UploadFiles"
import UploadService from "@/lib/UploadingServices/UploadFilesService";
import Vuex from "vuex";
import Vuetify from "vuetify"
import sinon from "sinon";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

// Preparing mocks
let mocks = {
    uploadOneFilePerRequestMock: null,
    uploadMultipleFilesPerRequestMock: null,
    restore: function(mockKey) {
        this[mockKey].restore();
    },
    restoreAll: function(){
        this.restore("uploadOneFilePerRequestMock");
        this.restore("uploadMultipleFilesPerRequestMock");
    },
    setMock: function(mockKey, targetClass, targetMethod, returnedValue){
        this[mockKey] = sinon.stub(targetClass, targetMethod);
        this[mockKey].returns(returnedValue);
    },
    throwMock: function(mockKey, targetClass, targetMethod){
        this[mockKey] = sinon.stub(targetClass, targetMethod).throws(new Error("error"));
    }
};


describe('UploadFiles.vue', () => {
    let wrapper;
    let wrapper2;
    let wrapper3;
    beforeAll(() => {
        wrapper = shallowMount(UploadFiles, {
            localVue,
            vuetify,
            propsData: {
                credentialInfo: {id: 1, token: 'myToken'},
                initialImages: ['/hoseinmirian.jpg'],
                uploadServiceName: "uploadOneFilePerRequest",
                allowedFileSizeMb: 3,
                baseApiEndpoint: "https://fairsharing-api.org/",
                mimeType: "image/*",
            }
        });
        mocks.setMock("uploadOneFilePerRequestMock",
            UploadService,
            "uploadOneFilePerRequest",
            "a.jpg"
        );
        mocks.setMock("uploadMultipleFilesPerRequestMock",
            UploadService,
            "uploadMultipleFilesPerRequest",
            ["a.jpg","b.jpg"]
        );

    });
    afterAll( () => {
        mocks.restoreAll();
    });


    it("can be instantiated", () => {
        // wrapper = shallowMount(UploadFiles,
        //     localVue,
        //     vuetify,
        //     {
        //         propsData: {
        //             credentialInfo: {id: 1, token: 'myToken'},
        //             initialImages: ['/hoseinmirian.jpg'],
        //             uploadServiceName: "uploadOneFilePerRequest",
        //             allowedFileSizeMb: 3,
        //             baseApiEndpoint: "https://fairsharing-api.org/",
        //             mimeType: "image/*",
        //         }
        //     }
        // );
        wrapper.vm.$refs['FileUpload'] = {
            afterUpload: jest.fn()
        };
        expect(wrapper.vm.$options.name).toMatch("UploadFiles");
    });

    it("can check selectFiles method functionality", () => {
        wrapper.vm.selectFiles([{img:'blablah'},{img:'aasd'}])
        expect(wrapper.vm.selectedFiles.length).toBe(2);
        wrapper.vm.selectFiles('image.jpg')
        expect(wrapper.vm.selectedFiles.length).toBe(1);
    })

    it("can check downloadFiles method functionality", async() => {
        wrapper.vm.downloadFiles(['a.jpg','b.jpg'])
        expect(wrapper.vm.fileInfos.length).toBe(2);
        await wrapper.setProps({initialImages:null})
        wrapper.vm.downloadFiles()
        expect(wrapper.vm.fileInfos.length).toBe(0);
        wrapper.vm.downloadFiles('a.jpg')
        expect(wrapper.vm.fileInfos.length).toBe(1);
    })

    it("can check uploadFiles method functionality", async() => {
        await wrapper.vm.uploadFiles(false)
        expect(wrapper.vm.selectedFiles).toBe(null)
    })


    it("can check upload method functionality", async() => {
        await wrapper.vm.upload(0,{name:''})
        expect(wrapper.vm.fileInfos.length).not.toBe(0)
    })

    it("can be instantiated without credentials", () => {
         wrapper2 = shallowMount(UploadFiles,
            {
                propsData: {
                    credentialInfo: null,
                    initialImages: null,
                    uploadServiceName: "uploadOneFilePerRequest",
                    allowedFileSizeMb: 3,
                    baseApiEndpoint: "https://fairsharing-api.org/",
                    mimeType: "image/*",
                }
            }
        );
        wrapper2.vm.$refs['FileUpload'] = {
            afterUpload: jest.fn()
        };
        expect(wrapper2.vm.$options.name).toMatch("UploadFiles");
    });


    it("can be instantiated to test multiple upload in one request", () => {
         wrapper3 = shallowMount(UploadFiles,
            {
                propsData: {
                    credentialInfo: {id: 1, token: 'myToken'},
                    initialImages: null,
                    uploadServiceName: "uploadMultipleFilesPerRequest",
                    allowedFileSizeMb: 3,
                    baseApiEndpoint: "https://fairsharing-api.org/",
                    mimeType: "image/*",
                    multipleUpload: true,
                    multipleFilesPerRequest: true,
                }
            }
        );
        wrapper3.vm.$refs['FileUpload'] = {
            afterUpload: jest.fn()
        };
        expect(wrapper3.vm.$options.name).toMatch("UploadFiles");
    });

    it("can check selectFiles to test multiple files in one request functionality", () => {
        wrapper3.vm.selectFiles([{img:'blablah'},{img:'aasd'}])
        expect(wrapper3.vm.selectedFiles.length).toBe(2);
        wrapper3.vm.selectFiles('image.jpg')
        expect(wrapper3.vm.selectedFiles.length).toBe(1);
    })

    it("can check uploadFiles with multiple files in one request functionality", async() => {
        await wrapper3.vm.uploadFiles(false)
        expect(wrapper.vm.selectedFiles).toBe(null)
        await wrapper3.vm.selectFilesForPreview(null)
        const blob = new Blob(['image/jpg']);
        const mFile = new File([blob], 'img.jpeg', {
            type: 'image/jpeg',
        });
        const fileContents       = 'data:image/png;base64,TEST1';
        const readAsDataURL      = jest.fn();
        const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
            target: {result: fileContents}} )});
        const dummyFileReader    = {addEventListener, readAsDataURL, result: fileContents};
        window.FileReader        = jest.fn(() => dummyFileReader);
        await wrapper3.vm.selectFilesForPreview([mFile,mFile])
        await expect(wrapper.vm.selectedFiles).toBe(null)
        wrapper3.vm.clearInput(false)
        await expect(wrapper.vm.imagesForUpload).toStrictEqual([])
        wrapper3.vm.clearInput(true)
        await expect(wrapper.vm.imagesForUpload).toStrictEqual([])
    })

});
