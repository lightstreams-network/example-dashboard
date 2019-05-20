import React  from 'react';
import ReactTable from 'react-table';

const PendingList = ({ user, requests, showModal, onAccept, onReject }) => {
    const columns = [{
        Header: 'From',
        width: 150,
        accessor: 'from' // String-based value accessors!
    }, {
        Header: 'Item',
        width: 100,
        accessor: 'item_id' // String-based value accessors!
    }, {
        Header: 'Created at',
        accessor: 'createdAt',
        width: 200,
        Cell: (item) => {
            const d = new Date(item.value);
            return d.toISOString();
        }
    }, {
        Header: 'Actions',
        accessor: 'item_id',
        width: 200,
        Cell: (item) => {
            return (
                <div>
                    <button onClick={() => {
                        onAccept({itemId: item.value, username: item.row.from});
                    }}><img src="https://img.icons8.com/bubbles/50/000000/add-user-male.png" />
                        Accept
                    </button>
                    <button onClick={() => {
                        onReject({ itemId: item.value, username: item.row.from });
                    }}><img src="https://img.icons8.com/bubbles/50/000000/delete-male-user.png"/>
                        Reject
                    </button>
                </div>
            )
        }
    }];

    return <ReactTable
        className='-striped -highlight'
        data={requests}
        columns={columns}
        defaultPageSize={5}
    />;
};

export default PendingList;