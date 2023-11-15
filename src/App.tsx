import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Main from './pages/main/main';
import PublicPage from './pages/public-page';
import SignInPage from './pages/auth/signin-page';
import SignUpPage from './pages/auth/signup-page';
import ModeToggle from './components/shared/mode-toggle';
import { ThemeProvider, useTheme } from './components/providers/theme-provider';
import { TaskContextWrapper } from './components/providers/task-provider';
import { dark } from '@clerk/themes';

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
					path="/"
					element={
						<>
							<SignedIn>
								<Main />
								<div className="fixed right-5 top-5 z-[999]">
									<UserButton afterSignOutUrl="/" />
								</div>
							</SignedIn>
							<SignedOut>
								<PublicPage />
							</SignedOut>
							<div className="fixed left-5 bottom-5 z-[999]">
								<ModeToggle />
							</div>
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
				<TaskContextWrapper>
					<ClerkProviderWithRoutes />
				</TaskContextWrapper>
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
