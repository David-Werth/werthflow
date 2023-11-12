import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';
import { Button } from '../ui/button';

export default function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<>
			{theme === 'light' ? (
				<Button variant={'outline'} onClick={() => setTheme('dark')}>
					<Moon />
				</Button>
			) : (
				<Button variant={'outline'} onClick={() => setTheme('light')}>
					<Sun />
				</Button>
			)}
		</>
	);
}
