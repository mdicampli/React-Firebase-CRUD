import { User } from "./UserForm"

const UsersTable = ({users, editUser, deleteUser}: {users: User[], editUser: (user: User) => void, deleteUser: (id: string) => void}) => {
    return <table className="table">
    <thead>
        <tr>
            <th scope="col">Name</th>
            <th scope="col">Surname</th>
            <th scope="col">Actions</th>
        </tr>
    </thead>
    <tbody>
        {users.length ? (
            users.map((user, i) => (
                <tr key={i}>
                    <td className="align-middle">{user.name}</td>
                    <td className="align-middle">{user.username}</td>
                    <td className="d-flex gap-2">
                        <button
                            className="btn btn-warning"
                            onClick={() => editUser(user)}
                        >
                            Edit
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => user.id && deleteUser(user.id)}
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan={3} className="text-center">
                    No users found
                </td>
            </tr>
        )}
    </tbody>
</table>

}

export default UsersTable;