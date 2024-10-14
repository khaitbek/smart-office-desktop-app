import { createFileRoute } from '@tanstack/react-router'

// use-cases
import { SignInForm } from '@/core/use-cases/user/sign-in/ui/SignInForm'

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
})

function SignIn() {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <SignInForm />
    </section>
  )
}
