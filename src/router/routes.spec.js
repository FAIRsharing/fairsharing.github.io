import routes from '@/router/routes.js'


describe('Routes', () => {
    it('routing variables are correctly set', () => {
        for (let routeIndex in routes){
            let route = routes[routeIndex];
            if (route.name !== 'Record'){
                expect(route.meta.title).toBe(route.name.replace(/_/g, ' '))
            }
        }
    })
})