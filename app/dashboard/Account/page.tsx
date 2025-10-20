// import { SignedIn } from '@clerk/nextjs'

// export default function Page() {
//   return (
    
//       {/* <SignedIn>
//         <div>You are signed in.</div>
//       </SignedIn>
//       <p>This content is always visible.</p> */}
    

    
//   )
// }

"use client";

import * as React from "react";

// Minimal login form (like the reference image), neutral style
export default function LoginForm() {
  return (
    <div className="justify-center items-center w-full max-w-sm rounded-2xl border border-neutral-300 p-6 space-y-6">
      {/* Header */}
      <header className="text-center">
        
        <p className="mt-2 text-sm text-neutral-500">
          Enter your credentials to access your account
        </p>
      </header>

      <form className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300  px-3 py-2 shadow-inner">
            <span className="i-heroicons-envelope text-neutral-500" aria-hidden />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className="flex items-center gap-2 rounded-xl border border-neutral-300  px-3 py-2 shadow-inner">
            <span className="i-heroicons-lock-closed text-neutral-500" aria-hidden />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full bg-transparent outline-none placeholder:text-neutral-400"
            />
            <button type="button" className="text-xs text-neutral-500 hover:text-neutral-700">
              Show
            </button>
          </div>
        </div>

        {/* Row: remember + forgot */}
        {/* <div className="items-center ">
          
          <div href="#" className="text-sm text-center text-neutral-600 hover:underline">
            Forgot password?
          </div>
        </div> */}

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full rounded-xl border border-neutral-300  px-4 py-2.5 font-medium "
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
