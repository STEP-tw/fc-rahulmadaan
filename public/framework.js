const isMatching = function (route, req) {
    if (route.method && req.method != route.method) return false;
    if (route.url && req.url != route.url) return false;
    if (route.url instanceof RegExp && route.url.test(req.url)) return true;
    return true;
};

const createApp = function () {
    const allRoutes = [];
    const app = function (req, res) {
        const matching = allRoutes.filter(route => isMatching(route, req));
        let remainingRoutes = matching.slice(0);
        const jumpToNext = () => {
            let current = remainingRoutes[0];
            if (!current) return;
            remainingRoutes = remainingRoutes.slice(1);
            current.handler(req, res, jumpToNext);
        }
        jumpToNext();
    }
    app.use = (handler) => allRoutes.push({ handler });
    app.get = (url, handler) => allRoutes.push({ method: "GET", url, handler });
    app.push = (url, handler) => allRoutes.push({ method: "PUSH", url, handler });

    return app;
}
module.exports = createApp;