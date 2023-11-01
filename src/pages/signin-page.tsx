import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
	return (
		<div className="h-full items-center justify-center flex">
			<SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
		</div>
	);
}
