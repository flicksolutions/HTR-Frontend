<script>
    import { sessionId } from '../routes/_store';
    import { onMount } from 'svelte';

    let collections = new Promise(() => {});
    let selectedCol;
    let selectedDoc;
    let docs;

    onMount(async () => {
        let response = await fetch('https://transkribus.eu/TrpServer/rest/collections/list?JSESSIONID='+$sessionId, {
            method: 'GET',
        });
        let data;
        if (response.status === 200) {
            console.log('status was 200, no need to refresh the session');
            collections = await response.json();
        } else {
            console.log('session needs to be refreshed!')
            fetch(`auth.json`).then(res => res.json()).then(json => sessionId.set(json.sessionId));
            response = await fetch('https://transkribus.eu/TrpServer/rest/collections/list?JSESSIONID='+$sessionId, {
                method: 'GET',
            });
            const collections = await response.json();
        }

        //console.log(collections);
    });

    const fetchDocs = async (id) => {
        console.log('running fetchDocs')
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/collections/${id}/list?JSESSIONID=${$sessionId}`, {
        method: 'GET',
        });
        const data = await res.json();
        //console.log(data);
        return data;
    }

    $: if (selectedCol) {fetchDocs(selectedCol.colId).then(res => docs = res);}
</script>

{#await collections then colls}
    <h2>Collection wählen:</h2>
    <select name="collection" size="{colls.length}" bind:value={selectedCol}>
        {#each colls as collection}
            <option value={collection}>{collection.colName}</option>
        {/each}
    </select>
{/await}
{#if docs}
    <h2>Dokument wählen:</h2>
    <select name="document" size="{docs.length}" bind:value={selectedDoc}>
        {#each docs as doc}
            <option value={doc}>{doc.title}</option>
        {/each}
    </select>
{/if}