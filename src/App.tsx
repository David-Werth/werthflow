import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Main from './pages/main';
import PublicPage from './pages/public-page';
import SignInPage from './pages/signin-page';
import SignUpPage from './pages/signup-page';

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
	const navigate = useNavigate();

	return (
		<ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
			<Routes>
				<Route path="/sign-in/*" element={<SignInPage />} />
				<Route path="/sign-up/*" element={<SignUpPage />} />
				<Route
					path="/"
					element={
						<>
							<SignedIn>
								<Main />
							</SignedIn>
							<SignedOut>
								<PublicPage />
							</SignedOut>
						</>
					}
				/>
			</Routes>
		</ClerkProvider>
	);
}

function App() {
	return (
		<BrowserRouter>
			<ClerkProviderWithRoutes />
		</BrowserRouter>
	);
}

export default App;
