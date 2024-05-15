import React, { useState } from 'react';
import { auth } from './firebase'; // Import the auth object from your Firebase configuration

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Sign in the user with email and password
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            // Access the signed-in user data if needed
            const user = userCredential.user;
            console.log('Logged in user:', user);
        } catch (error) {
            // Handle errors
            console.error('Login error:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h3>Login Form</h3>
            <input type="email" placeholder="Enter your email" className="box" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Enter your password" className="box" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div className="flex">
                <input type="checkbox" name="" id="remember-me" />
                <label htmlFor="remember-me">Remember me</label>
                <a href="#">Forgot password?</a>
            </div>
            <input type="submit" value="Login now" className="btn" />
            <p>Don't have an account? <a href="#">Create one!</a></p>
        </form>
    );
}

export default LoginForm;
