const isMatching = function (route, req) {
    if (route.method && req.method != route.method) return false;
    if (route.url && req.url != route.url) return false;
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
    app.post = (url, handler) => allRoutes.push({ method: "POST", url, handler });

    return app;
}
module.exports = createApp;