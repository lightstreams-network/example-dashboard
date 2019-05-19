import React, { useState } from 'react';
import ReactTable from 'react-table';

const FileList = ({ user, files, showModal, grantAccess, downloadFile}) => {
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
        accessor: 'id',
        Cell: (item) => {
            return (
                <div>
                    <button type="submit" onClick={() => {
                        downloadFile(item.value);
                    }}>Download</button>
                </div>
            )
        }
    }];

    return <ReactTable
        className='-striped -highlight'
        data={Object.values(files)}
        columns={columns}
        defaultPageSize={5}
    />;
};

export default FileList;