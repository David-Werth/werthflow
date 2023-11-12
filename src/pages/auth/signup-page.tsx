import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
	return (
		<div className="flex items-center justify-center h-full">
			<SignUp
				routing="path"
				path="/sign-up"
				signInUrl="/sign-in"
				afterSignInUrl="/"
			/>
		</div>
	);
}
