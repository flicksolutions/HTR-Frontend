<script>
    import "smelte/src/tailwind.css" ;
    import Button from "smelte/src/components/Button";
    import TextField from "smelte/src/components/TextField";
    import {URL} from './_store';

    export let keycloak;
    let collection = {
        name: "Unibe Test",
        id: 5636
    };
    let meta = {
        md: {
            title: "Title",
            author: "author",
            genre: "genre",
            writer: "writer",
        },
        pageList: {
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
    $: if (files && files[0]) {
        meta.pageList.pages[0].fileName = files[0].name
    }
    const startUpload = async () => {
        const res = await fetch(`${URL}/rest/uploads?collId=${collection.id}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json', //does not work yet, since this Header is not allowed
                'Authorization': 'Bearer ' + keycloak.token
            },
            body: JSON.stringify(meta),
            credentials: 'include'
        });
        console.log(res);
        const data = await res.json();
        console.log(data);
    }
</script>
<div className="container w-full" style="width: 100%">
    <h2>Uploading file into {collection.name}.</h2>
    <TextField bind:value={meta.md.title} />
    <TextField bind:value={meta.md.author}/>
    <TextField bind:value={meta.md.genre}/>
    <TextField bind:value={meta.md.writer}/>

    <input type="file" bind:files multiple>

    {#if files}
        <button on:click={startUpload}>upload file(s)</button>
    {/if}
</div>