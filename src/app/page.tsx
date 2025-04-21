import * as React from "react";

import {BookCardProps, default as BookCard} from "@/components/design/bookcard";

export default function Home() {

    const books: BookCardProps[] = [
        {
            title: "Fundamentals of Software Architecture",
            dateStart: new Date(Date.UTC(2025, 3, 14, 12, 0, 0)),
            dateEnd: new Date(Date.UTC(2025, 6, 1, 0, 0, 0))
        },
    ]

    return (
        <div
            className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-[16px] items-center sm:items-start">

                {books.map((book, index) => (
                    <BookCard key={index} {...book}/>
                ))}

            </main>
        </div>
    );
}
