import { SignedIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <>
      <SignedIn>
        <div>You are signed in.</div>
      </SignedIn>
      <p>This content is always visible.</p>
    </>
  )
}