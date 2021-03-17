export default {
    methods: {
        getIconName(name){
            return name.replace(/\s/g, '_').replace(/[\])}[{(]/g, '').replace(/\//g, '_').toLowerCase()
        }
    }
}
