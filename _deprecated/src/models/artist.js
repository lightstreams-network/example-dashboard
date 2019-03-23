const _ = require('lodash');

// @TODO Migrate to DB once it is decide where artist content is going to be fetch from
const artists = [{
    tokenSymbol: 'JB',
    profile: {
        tokenSymbol: 'JB',
        supply: 120,
        cap: 1000,
        name: 'Justin Bieber'
    },
    blockchain_info: {
        account: '0dd46808e9780e4a23dd562962300ba029bcffef',
        password: 'ico_fan_1',
        ico_address: '0x7251e7005dba3abb0aee4e772a5ff378a8eea885',
    },
    exclusive_content: [
        {
            name: 'ANA PROFILE',
            image_url: 'http://www.theshillongtimes.com/wp-content/uploads/2017/05/Music-745x430.jpg',
            filename: 'picture.jpeg',
            description: 'Listen to the new single',
            meta: 'QmaH5iGHiCpPQrPLLtEdLb29DZVZT3hix1n6yUdKcCMgC9',
            acl: '0xEa961398d2435BbC66E7871883Ac8303F2444897',
            allowed_users: ['0x40e967cb0403e74e3881de9aA79F1E06D35b0Cd5', '0xa4f835805Cd93894eC611537f0cA20e93Bc8B941'],
            price: 0
        },
        {
            name: 'GABRI PROFILE',
            image_url: 'http://www.dundeesciencecentre.org.uk/Uploads/2017/05/11/1rVvucKB_party-time-logo.jpg',
            description: 'See me in my last Bday party with friends',
            meta: 'QmVTcz683K2CB91yTmzWzBtgmSZNLT4AdwBnwzxMdjc6Ys',
            acl: '0x5455D2Cfd86bedac56D361262805d0D56b707FeF',
            filename: 'gabri_profile.png',
            allowed_users: [],
            price: 0
        },
        {
            name: 'FanBase',
            image_url: 'https://png.pngtree.com/element_origin_min_pic/16/06/12/16575d2268b68b9.jpg',
            description: 'Letter for all my best fans',
            meta: 'QmYR6vdGLVXDA1wig3pPqPtetkc2hu9SkQ9A6hMbXucX9N',
            acl: '0x5FEB511a82Fc81C9F283F7E6154600ef9031EC45',
            filename: 'fanBasePage.png',
            allowed_users: [],
            price: 7
        },
        {
            name: 'Personal Call',
            image_url: 'https://png.pngtree.com/element_pic/17/03/02/52b3a47f2d27e5bdd4dfa5c0ea2f091c.jpg',
            description: 'See me in my last Bday party with friends',
            meta: 'HASH_ID_4',
            allowed_users: [],
            price: 30
        },
        {
            name: 'VIP pass',
            image_url: 'http://worldartsme.com/images/vip-seating-clipart-1.jpg',
            description: 'Get VIP pass for my next concert',
            meta: 'HASH_ID_5',
            allowed_users: [],
            price: 999999
        }
    ]
}];

const getArtistByTokenSymbol = (tokenSymbol) => {
    const artist = artists.find(artist =>
        artist.tokenSymbol.toLowerCase() === tokenSymbol.toLowerCase()
    );

    if (!artist) throw new Error('Artist not found');

    return artist;
};

module.exports = (sequelize, DataTypes) => {
    // @TODO: Integrate DB
    const Model = sequelize.define('artist', {
    }, {
    });

    Model.getArtistProfile = async (tokenSymbol) => {
        const artist = getArtistByTokenSymbol(tokenSymbol);
        return artist.profile;
    };

    Model.getArtistExclusiveContentList = async (tokenSymbol) => {
        const artist = getArtistByTokenSymbol(tokenSymbol);
        return artist.exclusive_content;
    };

    Model.getOwnerOfContent = async (hashId) => {
        return artists.find(artist => {
            return artist.exclusive_content.filter(content => {
                return content.meta === hashId
            }).length > 0
        });
    };

    Model.getArtistExclusiveContentByMeta = async (tokenSymbol, hashId) => {
        const artist = getArtistByTokenSymbol(tokenSymbol);
        return artist.exclusive_content.find(content => {
            return content.meta === hashId
        })
    };

    Model.appendAllowUser = async (tokenSymbol, hashId, ethAddress) => {
        artists = artists.map(artist => {
            if (artist.tokenSymbol === tokenSymbol) {
                artist.exclusive_content = artist.exclusive_content.map(contentItem => {
                    if (contentItem.meta === hashId) {
                        contentItem.allowed_users.push(ethAddress)
                    }
                    return contentItem;
                });
            }

            return artist;
        });

        return artists;
    };

    Model.getArtistBlockchainInfo = async (tokenSymbol) => {
        const artist = getArtistByTokenSymbol(tokenSymbol);
        return artist.blockchain_info;
    };

    return Model;
};
