import { ClerkProvider } from "@clerk/tanstack-react-start";

export function AuthProvider({ children }: { children: React.ReactNode }) {
	return <ClerkProvider>{children}</ClerkProvider>;
}
