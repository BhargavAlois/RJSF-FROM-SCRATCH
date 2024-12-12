import React from 'react'

export default function MyPasswordWidget(props) {
  return (
    <div>
        <input type="password" onChange={props.onChange}/>
    </div>
  )
}
