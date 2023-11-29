import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../providers/theme-provider';
import { Button } from '../../ui/button';

export default function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<>
			{theme === 'light' ? (
				<Button
					variant={'outline'}
					onClick={() => setTheme('dark')}
					className="z-50"
				>
					<Moon />
				</Button>
			) : (
				<Button
					variant={'outline'}
					onClick={() => setTheme('light')}
					className="z-50"
				>
					<Sun />
				</Button>
			)}
		</>
	);
}
