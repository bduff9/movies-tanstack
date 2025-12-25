// React 19 compatible shim for use-sync-external-store/shim/with-selector
import { useSyncExternalStore } from 'react'

// useSyncExternalStoreWithSelector is used by @tanstack/react-store
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

export { useSyncExternalStoreWithSelector }

