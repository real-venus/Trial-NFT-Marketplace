import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Provider from "./_app"
import { Notification } from "@web3uikit/core"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "NftMarketplace",
    description: "NftMarketplace",
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Provider>
                    <Header />
                    {children}
                </Provider>
            </body>
        </html>
    )
}
