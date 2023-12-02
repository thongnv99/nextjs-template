'use client'
import { signIn } from 'next-auth/react'
import React from 'react'


const Login = () => {
  return (
    <div>
      <button type="button" className='text-red' onClick={() => signIn('google')}>Login</button>
    </div>
  )
}

export default Login