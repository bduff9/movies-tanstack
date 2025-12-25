// React 19 has useSyncExternalStore built-in, so we re-export from React
// This shim is needed because use-sync-external-store/shim doesn't properly support React 19
import { useSyncExternalStore } from 'react'

// useSyncExternalStoreWithSelector is used by @tanstack/react-store
// This is a simplified implementation for React 19
function useSyncExternalStoreWithSelector<Snapshot, Selection>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => Snapshot,
	getServerSnapshot: (() => Snapshot) | undefined,
	selector: (snapshot: Snapshot) => Selection,
	isEqual?: (a: Selection, b: Selection) => boolean,
): Selection {
	const instRef = { current: null as { snapshot: Snapshot; selection: Selection } | null }

	const getSelection = () => {
		const snapshot = getSnapshot()
		const selection = selector(snapshot)

		if (isEqual && instRef.current) {
			const prevSelection = instRef.current.selection
			if (isEqual(selection, prevSelection)) {
				return prevSelection
			}
		}

		instRef.current = { snapshot, selection }
		return selection
	}

	const getServerSelection =
		getServerSnapshot === undefined
			? undefined
			: () => selector(getServerSnapshot())

	return useSyncExternalStore(subscribe, getSelection, getServerSelection)
}

export { useSyncExternalStore, useSyncExternalStoreWithSelector }

