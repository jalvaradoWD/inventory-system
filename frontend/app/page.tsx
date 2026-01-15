import { redirect } from "next/navigation";

function Page() {
    redirect("/books");
    return <div>Root Page</div>;
}

export default Page;
