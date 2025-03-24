import React from 'react'

const AuthLayout = (
  { children }: { children: React.ReactNode }
) => {
  return (
    <div className='conatiner mx-auto'>{children}</div>
  )
}

export default AuthLayout