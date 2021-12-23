import {shallowMount} from "@vue/test-utils";
import UploadImages from "@/components/UploadImages/UploadImages"
import UploadService from "@/lib/UploadingServices/UploadFilesService";
import sinon from "sinon";

// Preparing mocks
let mocks = {
    uploadMock: null,
    restore: function(mockKey) {
        this[mockKey].restore();
    },
    restoreAll: function(){
        this.restore("uploadMock");
    },
    setMock: function(mockKey, targetClass, targetMethod, returnedValue){
        this[mockKey] = sinon.stub(targetClass, targetMethod);
        this[mockKey].returns(returnedValue);
    },
    throwMock: function(mockKey, targetClass, targetMethod){
        this[mockKey] = sinon.stub(targetClass, targetMethod).throws(new Error("error"));
    }
};


describe('UploadImages.vue', () => {
    let wrapper;

    beforeAll( async () => {
        mocks.setMock("uploadMock",
            UploadService,
            "uploadLogo",
            "a.jpg"
        );
    });
    afterAll( () => {
        mocks.restoreAll();
    });


    it("can be instantiated", () => {
        wrapper = shallowMount(UploadImages,
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
        expect(wrapper.name()).toMatch("UploadImages");
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
        const wrapper2 = shallowMount(UploadImages,
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
        expect(wrapper2.name()).toMatch("UploadImages");
    });





});
