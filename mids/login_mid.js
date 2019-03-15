module.exports = function(){
    return function(req, res,next)  {
        var user = req.session.user;
        return next();
        var whiteUrls = ['/api/login', '/visitor/add'];
        if (whiteUrls.indexOf(req.url) >= 0) {
            return next();
        } else if (req.method === 'GET') {
            return next();
        } else {
            if (!user) {
                res.status(401).json({
                    message: '登陆令牌已过期,请重新登陆'
                })
            } else {
                return next();
            }
        }
    }
}