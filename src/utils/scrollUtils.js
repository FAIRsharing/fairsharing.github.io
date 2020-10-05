import {gotoTop} from "@/utils/navigationUtils";

const scrollUtils = {
    methods: {
        scrollToTop(targetObject) {
            const targetDiv = document.getElementById(targetObject);
            gotoTop(targetDiv);
        }
    }
}

export default scrollUtils;
