import { createFileRoute } from "@tanstack/react-router";

import MovieItemForm from "@/components/MovieItemForm";

export const Route = createFileRoute("/_authenticated/item/add")({
	head: () => ({
		meta: [{ title: "Add Movie Item | Movie Tracker" }],
	}),
	component: AddPage,
});

function AddPage() {
	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<MovieItemForm />
		</div>
	)
}
