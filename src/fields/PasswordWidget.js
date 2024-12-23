import React from "react";
import { FaRegEyeSlash, FaEye } from "react-icons/fa6";

const PasswordWidget = (props) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleChange = (e) => {
        console.log("password widget : ", e);
        props.onChange(e.target.value);
    };

    return (
        <div className="input-group mb-3">
            <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder={props.placeholder}
                value={props.value || ''}
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
                    borderLeft: 'none',
                    borderRadius: '0.5',
                    backgroundColor: 'white',
                }}
            >
                {showPassword ? <FaEye /> : <FaRegEyeSlash />}
            </button>
            {props.errors && props.errors.map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
        </div>
    );
};

export default PasswordWidget;
