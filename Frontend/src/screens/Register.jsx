import { useState , useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../config/axios.js'
import {UserContext} from '../context/user.context.jsx'

const Register = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });
    const {setUser} = useContext(UserContext);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        axios.post('/users/register',
            {
                email: formData.email,
                password: formData.password,
            }
        )
            .then((res) => {
                console.log(res.data)
                localStorage.setItem('token',res.data.token)
                setUser(res.data.user)
                navigate('/')
            }).catch((err) => {
                console.log(err.response?.data || err.message);

            })

        console.log(formData);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">

            {/* Background Blur Effects */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            K
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Create Account
                        </h1>

                        <p className="text-zinc-400 mt-3">
                            Join us and get started today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">

                        <div>
                            <label className="block text-sm text-zinc-300 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-300 mb-2">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-indigo-500/20"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 h-px bg-zinc-800" />
                        <span className="px-4 text-zinc-500 text-sm">OR</span>
                        <div className="flex-1 h-px bg-zinc-800" />
                    </div>

                    {/* Google Button */}
                    <button
                        className="w-full py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition"
                    >
                        Continue with Google
                    </button>

                    {/* Footer */}
                    <p className="text-center text-zinc-400 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-indigo-400 hover:text-indigo-300 font-medium"
                        >
                            Sign In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Register;