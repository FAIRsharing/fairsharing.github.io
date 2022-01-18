const generalUtils = {
    methods: {
        getHostname() {
            return process.env.VUE_APP_HOSTNAME;
        },
        getAPIEndPoint() {
            return process.env.VUE_APP_API_ENDPOINT;
        }
    }
}

export function LightenDarkenColor(color, percent) {

    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    let RR = ((R.toString(16).length===1)?"0"+R.toString(16):R.toString(16));
    let GG = ((G.toString(16).length===1)?"0"+G.toString(16):G.toString(16));
    let BB = ((B.toString(16).length===1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

export const toBase64 = async (file) =>
    await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.toString().split(',')[1]);
    reader.onerror = error => reject(error);
});

/*export const toBase64 =  (file) => {
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
        return e.result.toString().split(',')[1]
    })
    reader.readAsDataURL(file);
}*/


export default generalUtils;