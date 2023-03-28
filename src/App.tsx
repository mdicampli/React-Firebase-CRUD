import { useEffect, useRef, useState } from "react";
import "./App.css";
import UserForm, { User, UserFormHandle } from "./components/UserForm";
import UsersTable from "./components/UsersTable";

const FIREBASE_URL =
	"https://infobasic-crud-default-rtdb.europe-west1.firebasedatabase.app";

function App() {
	const initialCurrentUserValue: User = { id: "", name: "", username: "" };

	const [users, setUsers] = useState<User[]>([]);
	const [currentUser, setCurrentUser] = useState<User>(initialCurrentUserValue);

	const resetCurrentUser = () => {
		setCurrentUser(initialCurrentUserValue);
	};

	const userForm = useRef<UserFormHandle>(null);

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
					userForm.current?.resetForm();
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
				userForm.current?.resetForm();
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
						return prevUsers.map((prevUser) =>
							prevUser.id === id ? updatedUser : prevUser
						);
					});
					resetCurrentUser();
					userForm.current?.resetForm();
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
		<div className="container d-flex flex-column py-5 gap-4 main-container">
			<h1 className="text-center">CRUD React + Firebase Deployed</h1>
			<div className="row gap-5">
				<div className="col pe-md-5">
					<h2 className="mb-4">{currentUser.id ? "Edit" : "Add"} user</h2>
					<UserForm
						ref={userForm}
						addUser={addUser}
						updateUser={updateUser}
						currentUser={currentUser}
					/>
				</div>
				<div className="col">
					<UsersTable
						users={users}
						editUser={editUser}
						deleteUser={deleteUser}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
