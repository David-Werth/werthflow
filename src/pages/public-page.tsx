import { Link } from 'react-router-dom';

import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function PublicPage() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-5">
			<h1 className="text-4xl font-bold sm:text-6xl md:text-8xl">WERTHFLOW</h1>

			<Link to={'/sign-in'} className="text-base">
				<Button variant={'outline'}>
					Enter
					<LogIn className="w-5 h-5 ml-2" />
				</Button>
			</Link>
		</div>
	);
}
