export default async function Page(props: PageProps<"/book/update/[id]">) {
    const { id } = await props.params;
    console.log(id);
    return (
        <>
            <h1>Test</h1>
        </>
    );
}
