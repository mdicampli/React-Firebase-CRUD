import { User } from "./UserForm";

const UsersTable = ({
	users,
	editUser,
	deleteUser,
}: {
	users: User[];
	editUser: (user: User) => void;
	deleteUser: (id: string) => void;
}) => {
	return (
		<table className="table">
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
							<td>
								<button
									className="btn btn-warning me-0 mb-2 me-md-2 mb-md-0"
									onClick={() => editUser(user)}
								>
									Edit
								</button>
								<button
									className="btn btn-danger me-0 mb-2 me-md-2 mb-md-0"
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
	);
};

export default UsersTable;
