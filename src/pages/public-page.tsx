import { Link } from 'react-router-dom';

import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';
import ModeToggle from '@/components/shared/sidebar/mode-toggle';

export default function PublicPage() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-5">
			<div className="fixed left-5 bottom-5">
				<ModeToggle />
			</div>
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
