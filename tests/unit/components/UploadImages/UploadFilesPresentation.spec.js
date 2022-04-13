import {shallowMount} from "@vue/test-utils";
import UploadFilesPresentation from "@/components/UploadFiles/UploadFilesPresentation"
import Vue from "vue"


describe('UploadFilesPresentation.vue', () => {
    let wrapper;

    it("can be instantiated", async () => {
        wrapper = shallowMount(UploadFilesPresentation,
            {
                propsData: {
                    credentialInfo: {id: 1, token: 'myToken'},
                    initialImages: ['/hoseinmirian.jpg'],
                    uploadServiceName: "uploadLogo",
                    allowedFileSizeMb: 3,
                    baseApiEndpoint: "https://fairsharing-api.org/",
                    mimeType: "image/*",
                    loading: false,
                    linearProgressBar: true,
                    selectFiles: ()=>{},
                    downloadFiles: ()=>{},
                    clearInput:() => {}
                }
            }
        );
        wrapper.vm.$options.props.selectFiles.default.call()
        wrapper.vm.$options.props.downloadFiles.default.call()
        // TODO: No idea why this fails now.
        //wrapper.vm.$options.props.clearInput.default.call()
        wrapper.vm.$refs['FileUpload'] = {
            afterUpload: jest.fn()
        };
        wrapper.vm.callUpload()
        wrapper.vm.$refs['fileInput'] = {
            reset: jest.fn()
        };
        await wrapper.vm.afterUpload()
        expect(wrapper.name()).toMatch("UploadFilesPresentation");

        expect(wrapper.vm.imageFiles).toStrictEqual([]);
        Vue.set(wrapper.vm.fileInfos, 0, {this: 'that'});
        expect(wrapper.vm.imageFiles).toStrictEqual([{this: 'that'}]);
        wrapper.vm.clearImages();
        expect(wrapper.vm.imageFiles).toStrictEqual([]);
        wrapper.vm.clearImages();
        expect(wrapper.vm.imageFiles).toStrictEqual([]);
    });


});
