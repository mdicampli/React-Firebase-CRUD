import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export interface User {
	id?: string;
	name: string;
	username: string;
}
type UserFormProps = {
	currentUser: User;
	addUser: (user: User) => void;
	updateUser: (updatedUser: User) => void;
};

export type UserFormHandle = {
	resetForm: () => void;
};

const UserForm = forwardRef<UserFormHandle, UserFormProps>(
	({ currentUser, addUser, updateUser }, ref) => {
		const {
			register,
			handleSubmit,
			setValue,
			reset,
			formState: { errors },
		} = useForm<User>({
			mode: "all",
		});

		useImperativeHandle(
			ref,
			() => {
				return {
					resetForm: () => {
						reset();
					},
				};
			},
			[]
		);

		const onSubmit: SubmitHandler<User> = (data) => {
			if (currentUser.id) {
				updateUser({ ...data, id: currentUser.id });
				return;
			}
			addUser(data);
		};

		useEffect(() => {
			if (currentUser.id) {
				setValue("name", currentUser.name, {
					shouldTouch: true,
					shouldDirty: true,
					shouldValidate: true,
				});
				setValue("username", currentUser.username, {
					shouldTouch: true,
					shouldDirty: true,
					shouldValidate: true,
				});
			}
		}, [currentUser.id]);

		return (
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-floating mb-3">
					<input
						type="text"
						className={`form-control ${errors.name ? "is-invalid" : ""}`}
						id="name"
						placeholder="Name"
						{...register("name", { required: "Field name is required" })}
					/>
					<label htmlFor="name" className="text-black-50">
						Name
					</label>
					{errors.name && (
						<div className="invalid-feedback">{errors.name?.message}</div>
					)}
				</div>

				<div className="form-floating mb-3">
					<input
						type="text"
						className={`form-control ${errors.username ? "is-invalid" : ""}`}
						id="username"
						placeholder="Username"
						{...register("username", {
							required: "Field username is required",
						})}
					/>
					<label htmlFor="username" className="text-black-50">
						Username
					</label>
					{errors.username && (
						<div className="invalid-feedback">{errors.username?.message}</div>
					)}
				</div>

				<button
					type="submit"
					className="btn btn-primary px-5"
					style={{ height: 58 }}
				>
					{currentUser.id ? "Update" : "Add"}
				</button>
			</form>
		);
	}
);

export default UserForm;
