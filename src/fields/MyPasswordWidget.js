import React from 'react'

export default function MyPasswordWidget(props) {
  return (
    <div>
        <label className="mt-2">{props.schema.title}</label>
        <input type="password" className="form-control" onChange={props.onChange}/>
        {/* <input type="password" onChange={(e) => {props.onChange(props.fieldName, e.target.value)}}/> */}
        {props.errors && props.errors.map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
    </div>
  )
}
