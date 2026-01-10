import Link from "next/link";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <section id="navbar">
                <ul>
                    <li>
                        <Link href={"/books"}>Home</Link>
                    </li>
                    <li>
                        <Link href={"/books/create"}>Create a Book</Link>
                    </li>
                </ul>
            </section>
            {children}
        </section>
    );
}
