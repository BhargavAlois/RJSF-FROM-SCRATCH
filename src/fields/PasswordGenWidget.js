import React from "react";
import { FaRegEyeSlash, FaEye } from "react-icons/fa6";

const PasswordGenWidget = (props) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [generatedPassword, setGeneratedPassword] = React.useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleChange = (e) => {
        props.onChange(e.target.value);
        setGeneratedPassword(e.target.value); // Sync the input value with the state
    };

    const generateRandomPassword = () => {
        const length = 12;
        const lowercase = "abcdefghijklmnopqrstuvwxyz";
        const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const numbers = "0123456789";
        const specialChars = "!@#$%^&*()";

        // Ensure the password contains at least one of each required character type
        const passwordArray = [
            lowercase[Math.floor(Math.random() * lowercase.length)],
            uppercase[Math.floor(Math.random() * uppercase.length)],
            numbers[Math.floor(Math.random() * numbers.length)],
            specialChars[Math.floor(Math.random() * specialChars.length)]
        ];

        // Fill the rest of the password length with random characters from all sets
        const allChars = lowercase + uppercase + numbers + specialChars;
        for (let i = passwordArray.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            passwordArray.push(allChars[randomIndex]);
        }

        // Shuffle the resulting array to avoid predictable patterns
        const shuffledPassword = passwordArray.sort(() => 0.5 - Math.random()).join('');
        setGeneratedPassword(shuffledPassword);
        props.onChange(shuffledPassword); // Pass the generated password to the parent component
    };

    React.useEffect(() => {
        if (props.value) {
            setGeneratedPassword(props.value);
        }
    }, [props.value]);

    return (
        <div>
        <div className="input-group">
            <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                name="passwordGenerator"
                placeholder={props.placeholder}
                value={generatedPassword || ''}
                onChange={handleChange}
                onBlur={props.onBlur}
                onFocus={props.onFocus}
                required={props.required}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="btn"
                style={{
                    border: '1px solid #ced4da',
                    borderRadius: '0.5',
                    backgroundColor: 'white',
                }}
            >
                {showPassword ? <FaEye /> : <FaRegEyeSlash />}
            </button>
            <button
                type="button"
                onClick={generateRandomPassword}
                className="btn"
                style={{
                    border: '1px solid #ced4da',
                    borderRadius: '0.5',
                    backgroundColor: 'white',
                }}
            >
                Generate
            </button>
        </div>
        {props.errors && props.errors.map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
        </div>
    );
};

export default PasswordGenWidget;
