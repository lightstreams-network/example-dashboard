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
                                   <span>
                                       <img src="https://img.icons8.com/bubbles/50/000000/delete-male-user.png" />
                                       {username}
                                   </span>)
                           }
                        })
                    }
                </div>
            );
        }
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