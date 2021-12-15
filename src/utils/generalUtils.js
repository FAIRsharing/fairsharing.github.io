const generalUtils = {
    methods: {
        getHostname() {
            return process.env.VUE_APP_HOSTNAME;
        }
    }
}

export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString().split(',')[1]);
    reader.onerror = error => reject(error);
});


export default generalUtils;