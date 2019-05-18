import React, { useState } from 'react';
import ReactTable from 'react-table';

const FileList = ({ user, files, showModal, grantAccess}) => {
    const [toAccount, setToAccount] = useState('');
    const columns = [{
        Header: 'Title',
        accessor: 'title' // String-based value accessors!
    }, {
        Header: 'Description',
        accessor: 'description' // String-based value accessors!
    },{
        Header: 'Meta',
        accessor: 'meta',
    }, {
        Header: 'Permissions Contract',
        accessor: 'acl',
    }, {
        Header: 'Actions',
        accessor: 'acl',
        Cell: (row) => (
            <form
                onSubmit={(e) => {
                    const grant = {
                        acl: row.value,
                        ownerAccount: user.ethAddress,
                        password: user.password,
                        toAccount,
                        permissionType: 'read'
                    };
                    grantAccess(grant);
                    e.preventDefault();
                }}
            >
                <input type='text' onChange={(e) => setToAccount(e.target.value)} value={toAccount} />
                <button type='submit'>Grant</button>
            </form>
        )
    }];

    return <ReactTable
        className='-striped -highlight'
        data={files}
        columns={columns}
        defaultPageSize={5}
    />;
};

export default FileList;