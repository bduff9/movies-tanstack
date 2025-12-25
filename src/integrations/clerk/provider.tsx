import { ClerkProvider } from "@clerk/tanstack-start";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	return <ClerkProvider>{children}</ClerkProvider>;
}
