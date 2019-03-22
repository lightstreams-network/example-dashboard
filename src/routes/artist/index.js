const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const { passport } = require('../../services/auth');
const { artist: Artist } = require('../../models');

const { etherToWei, weiToEth } = require('../../lib/helpers');
const { grantReadAccess, getCoinBalance, purchaseCoins, transferIco, downloadFileContent, getWalletBalance } = require('../../services/gateway');
const { verifyUser } = require('../../services/user');
const { jsonResponse } = require('../../lib/responses');

const debug = require('debug')('fanbase:server');

router.get('/get-profile', async (req, res, next) => {
    try {
        const { symbol } = req.query;
        const profile = await Artist.getArtistProfile(symbol);
        res.json(jsonResponse(profile));
    } catch ( err ) {
        debug(err);
        next(err);
    }
});

router.get('/get-exclusive-content', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { symbol } = req.query;
        const exclusiveContentList = await Artist.getArtistExclusiveContentList(symbol);
        const filteredExclusiveContentList = exclusiveContentList.map(content => {
            return {
                ...content,
                allowed_users: null,
                is_unlock: content.allowed_users.indexOf(req.user.eth_address) !== -1
            };
        });
        res.json(jsonResponse(filteredExclusiveContentList));
    } catch ( err ) {
        debug(err);
        next(err);
    }
});

router.get('/get-coin-balance', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { symbol } = req.query;
        const artistBlockchainInfo = await Artist.getArtistBlockchainInfo(symbol);
        const { balance } = await getCoinBalance(req.user.eth_address, artistBlockchainInfo.ico_address);
        res.json(jsonResponse({ symbol, balance }));
    } catch(err) {
        debug(err);
        next(err);
    }
});

router.post('/purchase-coin', passport.authenticate('jwt', { session: false }), async (req, res, next) => {

    try {
        const { symbol, amount } = req.query;
        const { password } = req.body;
        const tokenAmount = parseFloat(amount);

        if (tokenAmount < 0.1) {
            throw new Error(`Minimum amount allowed is '0.1'`);
        }

        await verifyUser(req.user.email, password);
        const artistBlockchainInfo = await Artist.getArtistBlockchainInfo(symbol);
        let { balance } = await getWalletBalance(req.user.eth_address, artistBlockchainInfo.ico_address);
        if (balance < etherToWei(tokenAmount)) {
            throw new Error(`Your balance is too low ${weiToEth(balance)} ETH`);
        }
        const { coins } = await purchaseCoins(req.user.eth_address,
            artistBlockchainInfo.ico_address,
            password, etherToWei(tokenAmount)
        );
        res.json(jsonResponse({ coins }));
    } catch(err) {
        debug(err);
        next(err);
    }
});

router.get('/stream-test-file', async (req, res) => {
    const filePath = path.join(__dirname, 'test-file.txt');
    const src = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename=test-file.txt');
    src.pipe(res);
});

router.post('/purchase-content', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
    try {
        const { content_meta, symbol } = req.query;
        const { password } = req.body;

        await verifyUser(req.user.email, password);
        const contentItem = await Artist.getArtistExclusiveContentByMeta(symbol, content_meta);
        if (contentItem.price > 0) {
            const artistBlockchainInfo = await Artist.getArtistBlockchainInfo(symbol);
            let { balance } = await getCoinBalance(req.user.eth_address, artistBlockchainInfo.ico_address);
            if (balance < contentItem.price) {
                throw new Error(`Your balance is too low to purchase that content`);
            }
            await transferIco(artistBlockchainInfo.ico_address,
                artistBlockchainInfo.account,
                req.user.eth_address,
                password,
                contentItem.price
            );
        }
        const artistBlockchainInfo = await Artist.getArtistBlockchainInfo(symbol);
        await grantReadAccess(artistBlockchainInfo.account, artistBlockchainInfo.password, contentItem.acl, req.user.eth_address);
        await Artist.appendAllowUser(symbol, content_meta, req.user.eth_address);
        res.json(jsonResponse(true));
    } catch(err) {
        debug(err);
        next(err);
    }
});

router.get('/download-file-content', async (req, res, next) => {
    try {
        const { content_meta, symbol, leth_token } = req.query;
        const contentItem = await Artist.getArtistExclusiveContentByMeta(symbol, content_meta);
        downloadFileContent(req, res, leth_token, contentItem.meta, contentItem.filename);
    } catch ( err ) {
        debug(err);
        next(err);
    }
});

module.exports = router;
