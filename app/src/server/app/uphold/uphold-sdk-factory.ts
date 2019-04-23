const config = require('../config');

export class UpholdSdkFactory {
    public create(req: any) {
        let user = req.user;

        if (!user) {
            console.log('uphold authentication: no user');
            return null;
        }
        console.log('user.uphold:');
        console.log(user.uphold);

        if (!user.uphold || !user.uphold.token || !user.uphold.token.access_token) {
            console.log('uphold authentication: no token');
            return null;
        }

        let token = user.uphold.token;

        return require(config.UPHOLD_LIB)({
            bearer: token.access_token
        });
    }
}
