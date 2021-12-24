import {shallowMount} from "@vue/test-utils";
import UploadFiles from "@/components/UploadFiles/UploadFiles"
import UploadService from "@/lib/UploadingServices/UploadFilesService";
import sinon from "sinon";

// Preparing mocks
let mocks = {
    uploadMock: null,
    uploadMultipleFilesPerRequestMock: null,
    restore: function(mockKey) {
        this[mockKey].restore();
    },
    restoreAll: function(){
        this.restore("uploadMock");
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
    beforeAll( async () => {
        mocks.setMock("uploadMock",
            UploadService,
            "uploadLogo",
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
        wrapper = shallowMount(UploadFiles,
            {
                propsData: {
                    credentialInfo: {id: 1, token: 'myToken'},
                    initialImages: ['/hoseinmirian.jpg'],
                    uploadServiceName: "uploadLogo",
                    allowedFileSizeMb: 3,
                    baseApiEndpoint: "https://fairsharing-api.org/",
                    mimeType: "image/*",
                }
            }
        );
        wrapper.vm.$refs['FileUpload'] = {
            afterUpload: jest.fn()
        };
        expect(wrapper.name()).toMatch("UploadFiles");
    });

    it("can check selectFiles method functionality", () => {
        wrapper.vm.selectFiles([{img:'blablah'},{img:'aasd'}])
        expect(wrapper.vm.selectedFiles.length).toBe(2);
        wrapper.vm.selectFiles('image.jpg')
        expect(wrapper.vm.selectedFiles.length).toBe(1);
    })

    it("can check downloadFiles method functionality", () => {
        wrapper.vm.downloadFiles(['a.jpg','b.jpg'])
        expect(wrapper.vm.fileInfos.length).toBe(2);
        wrapper.setProps({initialImages:null})
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
                    uploadServiceName: "uploadLogo",
                    allowedFileSizeMb: 3,
                    baseApiEndpoint: "https://fairsharing-api.org/",
                    mimeType: "image/*",
                }
            }
        );
        wrapper2.vm.$refs['FileUpload'] = {
            afterUpload: jest.fn()
        };
        expect(wrapper2.name()).toMatch("UploadFiles");
    });


    it("can be instantiated to test multiple upload in one request", () => {
         wrapper3 = shallowMount(UploadFiles,
            {
                propsData: {
                    credentialInfo: null,
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
        expect(wrapper3.name()).toMatch("UploadFiles");
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
    })


});
