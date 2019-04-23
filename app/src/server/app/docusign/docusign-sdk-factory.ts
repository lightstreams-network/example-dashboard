const config = require('../config');

export class DocusignSdkFactory {
    public create(req: any) {
        let user = req.user;
        if (!user) {
            console.log('docusign authentication: no user');
            return null;
        }
        console.log('user.docusign:');
        console.log(user.docusign);

        if (!user.docusign || !user.docusign.token || !user.docusign.token.access_token) {
            console.log('docusign authentication: no token');
            return null;
        }

        let baseUri = config.DOCUSIGN_URL;
        if (req.body && req.body.accountDomain) {
            baseUri = req.body.accountDomain;
        }

        let token = user.docusign.token;
        return require(config.DOCUSIGN_LIB)({
            bearer: token.access_token,
            host: baseUri
        });
    }
}
