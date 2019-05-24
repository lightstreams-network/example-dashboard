/**
 * User: ggarrido
 * Date: 22/04/19 8:35
 * Copyright 2019 (c) Lightstreams, Granada
 */

const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

const Dashboard = artifacts.require("Dashboard");
const Profile = artifacts.require("Profile");
const { web3Cfg } = require('src/lib/config');

contract('Dashboard', (accounts) => {
  const ROOT_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[0] : web3Cfg.from;
  const USER_ACCOUNT = process.env.NETWORK === 'ganache' ? accounts[1] : '0x3a4D89734F60ED62773CC14d042aDB5d2B8d3B3E';
  const USER2_ACCOUNT = accounts[2];

  let profileInstance;
  const newUser = {
    username: 'username',
    ipfs: 'QXsas....'
  };

  it('should create a new user into dashboard', async () => {
    const dashboardInstance = await Dashboard.deployed();
    profileInstance = await Profile.new({ from: USER_ACCOUNT });

    await dashboardInstance.createUser(USER_ACCOUNT, newUser.username, profileInstance.address, newUser.ipfs);
    const username = await dashboardInstance.username({
      from: USER_ACCOUNT
    });
    const username2 = await dashboardInstance.findUsername(USER_ACCOUNT, {
      from: ROOT_ACCOUNT
    });
    const userAddress = await dashboardInstance.findUser(newUser.username, {
      from: ROOT_ACCOUNT
    });

    const owner = await profileInstance.owner();
    assert.equal(owner.toLowerCase(), USER_ACCOUNT.toLowerCase(), 'Invalid expected owner account');
    assert.equal(newUser.username, username);
    assert.equal(newUser.username, username2);
    assert.equal(USER_ACCOUNT, userAddress);
  });

  it('should deploy an permissioned file contract and grant with admin rights to profile SC', async () => {
    const dashboardInstance = await Dashboard.deployed();
    permissionedFileInstance = await PermissionedFile.new(USER_ACCOUNT);
    await permissionedFileInstance.grantAdmin(dashboardInstance.address, {
      from: USER_ACCOUNT
    });

    const isOwner = await profileInstance.isOwner({from: USER_ACCOUNT});
    assert.equal(isOwner, true, 'Invalid owner');
    await profileInstance.stackItem("title", "description", "meta", permissionedFileInstance.address, {
      from: USER_ACCOUNT,
      gas: '1000000'
    });

    const hasAccess = await permissionedFileInstance.hasAdmin(dashboardInstance.address);
    assert.equal(hasAccess, true, 'Access was not granted successfully');
  });
});