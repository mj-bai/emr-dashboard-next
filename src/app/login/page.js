'use client'

import { useActionState } from 'react'
import { authenticate } from './actions'

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Dr. Bai's EMR</h1>
        <p>Please log in to access patient records.</p>
        
        <form action={formAction} className="login-form">
          <input 
            type="email" 
            name="email" 
            placeholder="Email (use demo@clinic.com)" 
            required 
            defaultValue="demo@clinic.com"
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password (use 'password')" 
            required 
            defaultValue="password"
          />
          <button type="submit" aria-disabled={isPending}>
            {isPending ? 'Logging in...' : 'Log in'}
          </button>
          
          {errorMessage && (
            <p style={{ color: 'var(--accent-red)', marginTop: '1rem' }}>{errorMessage}</p>
          )}
        </form>
      </div>
    </div>
  )
}
