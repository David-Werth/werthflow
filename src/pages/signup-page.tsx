import { SignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
	return (
		<div className="h-full items-center justify-center flex">
			<SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
		</div>
	);
}
