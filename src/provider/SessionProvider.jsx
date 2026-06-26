import { SessionProvider } from "next-auth/react"

export default function SessionProviderMain({ children }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
