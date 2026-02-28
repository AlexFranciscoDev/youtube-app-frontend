import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

export const Login = () => {
  return (
    <div className='dark-container'>
      <section className='layout-container block m-0' >
        <div className='w-6/12 bg-[var(--background-card)] p-8 border-1 border-[var(--background-gradient)] rounded-xl'>
          <FontAwesomeIcon icon={faPlay} />
          <h1 className='text-[var(--color-title)] '>Welcome</h1>
          <p>Login to your account to organize your videos</p>
          <form action="">
            <label htmlFor="user">
              Username or email
              <br />
              <input type="text" placeholder='you@email.com' />
            </label>
            <br />
            <label htmlFor="password">
              <div>
                <span>Password:</span>
                <a href="#">Forgot password?</a>
              </div>
              <br />
              <input type="password" placeholder='*******' />
              <br />
              <input type="button" value="Login" />
            </label>
          </form>
          <p>You don't have an account yet? <a href='#'>Register</a></p>
        </div>
      </section>
    </div>
  )
}
