<script>
    import { token, authenticated } from '../routes/_store';
    import { onMount } from 'svelte';

    export let keycloak;

    let collection = {
        name: "worck_testcollection",
        id: 76207
    };
    let meta = {
        md: {
            title: "Title",
            author: "author",
            genre: "genre",
            writer: "writer",
        },
        pagelist: {
            pages: [
                {
                    fileName: "filename1",
                    pageNr: 1,
                }
            ]
        }
    };
    let files;
    //$: if (keycloak.token) sessionId.set(keycloak.token)
    $: console.log(meta);
    $: if (files && files[0]) {meta.pagelist.pages[0].fileName = files[0].name}

    const startUpload = async () => {
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/uploads?collId=${collection.id}&JSESSIONID=${$sessionId}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(meta),
            credentials: 'include'
        });
        console.log(res);
        const data = await res.json();
        console.log(data);
    }

</script>
<div class="container">
    Uploading file into {collection.name}.
    <input type="text" bind:value={meta.md.title}>
    <input type="text" bind:value={meta.md.author}>
    <input type="text" bind:value={meta.md.genre}>
    <input type="text" bind:value={meta.md.writer}>

    <input type="file" bind:files multiple>

    {#if files}
        <button on:click={startUpload}>upload file(s)</button>
    {/if}
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }
    img {
        max-width: 100%;
        grid-column: 1 / -1;
    }
</style>