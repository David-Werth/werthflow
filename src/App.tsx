import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { dark } from '@clerk/themes';

import { ThemeProvider, useTheme } from '@/providers/theme-provider';
import { UserDataContextWrapper } from '@/providers/user-data-provider';

import HomePage from '@/pages/main/home-page/home-page';
import PublicPage from '@/pages/main/public-page';
import SignInPage from '@/pages/auth/signin-page';
import SignUpPage from '@/pages/auth/signup-page';
import Sidebar from '@/pages/main/home-page/sidebar/sidebar';

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
	throw new Error('Missing Publishable Key');
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithRoutes() {
	const navigate = useNavigate();
	const { theme } = useTheme();

	return (
		<ClerkProvider
			publishableKey={clerkPubKey}
			navigate={(to) => navigate(to)}
			appearance={theme === 'dark' ? { baseTheme: dark } : {}}
		>
			<Routes>
				<Route path="/sign-in/*" element={<SignInPage />} />
				<Route path="/sign-up/*" element={<SignUpPage />} />
				<Route
					path="/*"
					element={
						<>
							<SignedIn>
								<div className="flex w-full h-full">
									<Sidebar />
									<HomePage />
								</div>
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
			<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
				<UserDataContextWrapper>
					<ClerkProviderWithRoutes />
				</UserDataContextWrapper>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
