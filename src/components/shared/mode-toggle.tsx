import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';
import { Button } from '../ui/button';

export default function ModeToggle() {
	const { setTheme, theme } = useTheme();

	return (
		<Button variant={'outline'}>
			{theme === 'light' ? (
				<Moon onClick={() => setTheme('dark')} />
			) : (
				<Sun onClick={() => setTheme('light')} />
			)}
		</Button>
	);
}
