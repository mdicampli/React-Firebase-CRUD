import { useEffect, useState } from "react";
import "./App.css";
import UserForm, { User } from "./components/UserForm";

const FIREBASE_URL =
	"https://infobasic-crud-default-rtdb.europe-west1.firebasedatabase.app";

function App() {
	const initialCurrentUserValue: User = { id: "", name: "", username: "" };

	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User>(initialCurrentUserValue);

	const resetCurrentUser = () => {
		setCurrentUser(initialCurrentUserValue);
	};

	useEffect(() => {
		fetch(`${FIREBASE_URL}/users.json`, {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					const fetchedUsers: User[] = [];
					Object.keys(data).forEach((key) =>
						fetchedUsers.push({ ...data[key], id: key })
					);
					setUsers(fetchedUsers);
				}
			})
			.catch((err) => console.error(err));
	}, []);

	const addUser = (user: User) => {
		fetch(`${FIREBASE_URL}/users.json`, {
			method: "POST",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				setUsers((prevUsers) => [...prevUsers, { ...user, id: data.name }]);
			})
			.catch((err) => console.error(err));
	};

	const editUser = (user: User) => {
		setCurrentUser(user);
	};

	const updateUser = (updatedUser: User) => {
		const { id, ...user } = updatedUser;
		setCurrentUser(updatedUser);
		fetch(`${FIREBASE_URL}/users/${id}.json`, {
			method: "PUT",
			headers: { "Content-type": "application/json" },
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data) {
					setUsers((prevUsers) => {
						console.log(prevUsers);
						return prevUsers.map((prevUser) =>
							prevUser.id === id ? updatedUser : prevUser
						);
					});
					resetCurrentUser();
				}
			})
			.catch((err) => console.error(err));
	};

	const deleteUser = (id: string) => {
		fetch(`${FIREBASE_URL}/users/${id}.json`, {
			method: "DELETE",
		})
			.then((res) => res.json())
			.then(() => {
				setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
			})
			.catch((err) => console.error(err));
	};

	return (
		<div className="container d-flex flex-column py-5 gap-4">
			<h1 className="text-center">CRUD React + Firebase</h1>
			<div className="row">
				<div className="col pe-5">
					<h2 className="mb-4">{currentUser.id ? "Edit" : "Add"} user</h2>
					<UserForm
						addUser={addUser}
						updateUser={updateUser}
						currentUser={currentUser}
					/>
				</div>
				<div className="col">
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
				</div>
			</div>
		</div>
	);
}

export default App;
