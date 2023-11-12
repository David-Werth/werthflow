import { SignIn } from '@clerk/clerk-react';

export default function SignInPage() {
	return (
		<div className="flex items-center justify-center h-full">
			<SignIn
				routing="path"
				path="/sign-in"
				signUpUrl="/sign-up"
				afterSignUpUrl="/"
			/>
		</div>
	);
}
