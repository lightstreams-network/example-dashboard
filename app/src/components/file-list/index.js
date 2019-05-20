import React  from 'react';
import ReactTable from 'react-table';

import {
    TableActionButton,

} from '../elements';

const FileList = ({ user, files, showModal, revokeAccess, downloadFile, }) => {
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
        width: 200,
        accessor: 'description' // String-based value accessors!
    }, {
        Header: 'Granted users',
        accessor: 'events',
        Cell: (item) => {
            const grantedUsers = item.value.reduce((acum, e) => {
                if(typeof e.to !== 'undefined') {
                    acum[e.to] = e.status === 'granted';
                }
                return acum;
            }, {});
            return (
                <div>
                    {
                        Object.keys(grantedUsers).map((username) => {
                           if(grantedUsers[username]) {
                               return (
                                   <TableActionButton onClick={() => revokeAccess({ itemId: item.row.id, username}) }>
                                       <img src="https://img.icons8.com/bubbles/50/000000/delete-male-user.png"/>
                                       {username}
                                   </TableActionButton>
                               )
                           }
                        })
                    }
                </div>
            );
        }
    }, {
        Header: 'Actions',
        accessor: 'id',
        width: 85,
        Cell: (item) => {
            return (
                <TableActionButton type="submit" onClick={() => {
                    downloadFile(item.value);
                }}>
                    <img src="https://img.icons8.com/ios/64/000000/download-from-cloud.png" />
                </TableActionButton>
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