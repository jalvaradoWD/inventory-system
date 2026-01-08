import { useEffect } from "react";

export default function Items() {
    useEffect(() => {
        fetch("http://localhost:8000/")
    });

    return (
        <>
            <h1>Hello world! From the Items page.</h1>
        </>
    );
}
