import React from 'react';
import ReactTable from 'react-table';

import {
    TableActionButton,
} from '../elements';

const UserFileList = ({ user, files, showModal, requestAccess, downloadFile }) => {
    const columns = [{
        Header: 'Id',
        width: 25,
        accessor: 'id' // String-based value accessors!
    }, {
        Header: 'Title',
        width: 100,
        accessor: 'title' // String-based value accessors!
    }, {
        Header: 'Description',
        accessor: 'description' // String-based value accessors!
    }, {
        Header: 'Actions',
        accessor: 'events',
        width: 120,
        Cell: (item) => {
            const hasAccess = item.value.reduce((acum, e) => {
                if(e.to === user.username) {
                    if(e.status === 'granted') return true;
                    else if(e.status === 'revoked') return false;
                }
                return acum;
            }, false);

            return (
                <div>
                { hasAccess
                    ? <TableActionButton type="submit" onClick={() => {
                        downloadFile(item.row.id);
                    }}><img src="https://img.icons8.com/ios/64/000000/download-from-cloud.png"/>
                    </TableActionButton>
                    : <TableActionButton type="submit" onClick={() => {
                        requestAccess(item.row.id);
                    }}><img src="https://img.icons8.com/wired/64/000000/unlock.png"/>
                    </TableActionButton>
                }</div>
            );
        }
    }];

    if (Object.values(files).length === 0) return null;

    return <ReactTable
        className='-striped -highlight'
        data={Object.values(files)}
        columns={columns}
        defaultPageSize={5}
    />;
};

export default UserFileList;