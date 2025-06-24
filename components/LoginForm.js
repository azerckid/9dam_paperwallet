import { useForm } from 'react-hook-form';

export default function Form() {
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ mode: 'onChange' });
    const onValid = (data) => {
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        reset({ username: "", password: "", email: "" });
    }
    const onInvalid = (errors) => {
        console.log('invalid', errors)
    }

    return (
        <form className="flex flex-col items-center justify-center gap-4" onSubmit={handleSubmit(onValid, onInvalid)}>
            <input
                className="w-72 my-2 p-2 border border-gray-300 rounded"
                {...register("username", {
                    required: "username is required",
                    minLength: {
                        message: "The username should be longer than 5 chars.",
                        value: 5
                    }
                })}
                type='text'
                placeholder='username'
            />
            {errors.username?.message && <span className="text-red-500">{errors.username.message}</span>}
            <input
                className="w-72 my-2 p-2 border border-gray-300 rounded"
                {...register("password", {
                    required: "password is required"
                })}
                type='text'
                placeholder='password'
            />
            {errors.password && <span className="text-red-500">This field is required</span>}
            <input
                className="w-72 my-2 p-2 border border-gray-300 rounded"
                {...register("email", {
                    required: "email is required",
                })}
                type='text'
                placeholder='email'
            />
            {errors.email?.message && <span className="text-red-500">{errors.email.message}</span>}
            <input
                className="w-24 my-2 p-2 bg-gray-300 border-none rounded cursor-pointer"
                type="submit"
            />
        </form>
    );
}