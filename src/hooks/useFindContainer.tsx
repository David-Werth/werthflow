import { Items } from '@/lib/types/items';
import { UniqueIdentifier } from '@dnd-kit/core';

export function useFindContainer(id: UniqueIdentifier, items: Items) {
	if (id in items) {
		return id;
	}

	for (const key in items) {
		if (items[key as keyof Items].some((item) => item.id.toString() === id)) {
			return key;
		}
	}

	return null;
}
