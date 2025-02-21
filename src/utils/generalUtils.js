const generalUtils = {
  methods: {
    getHostname() {
      return import.meta.env.VITE_HOSTNAME;
    },
    getAPIEndPoint() {
      return import.meta.env.VITE_API_ENDPOINT;
    },
    sortObj(obj) {
      return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
      }, {});
    },
    formatDate(d){
      let date = new Date(d);
      return (
        date.toLocaleString("default", { month: "short" }) +
             " " +
             date.getUTCDate() +
             ", " +
             date.getUTCFullYear()
      );
    },
    compareRecordDescUpdate(a, b) {
      if (a.updatedAt > b.updatedAt) {
        return -1;
      }
      else {
        return 1;
      }
    },
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

export default generalUtils;