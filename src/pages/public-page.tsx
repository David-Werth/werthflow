import { Link } from 'react-router-dom';

import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function PublicPage() {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-5 font-bold text-8xl">
			<h1>WERTHFLOW</h1>

			<Link to={'/sign-in'} className="text-base">
				<Button variant={'outline'}>
					Enter
					<LogIn className="w-5 h-5 ml-2" />
				</Button>
			</Link>
		</div>
	);
}
