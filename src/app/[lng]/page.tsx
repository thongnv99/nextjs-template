import React from 'react'


const page = (props: { params: { lng: string } }) => {
  return (
    <div>{props.params.lng}</div>
  )
}

export default page