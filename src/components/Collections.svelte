<script>
    import { sessionId } from '../routes/_store';
    import { onMount } from 'svelte';

    let collections = new Promise(() => {});
    let selectedCol;
    let selectedDoc;
    let docs;
    let statusLA;
    let jobs = new Promise(() => {});
    let docXML = new Promise(() => {});
    let fullDoc;
    let reloadJob;

    onMount(async () => {
        console.log('running collections onmount')
        let response = await fetch('https://transkribus.eu/TrpServer/rest/collections/list?JSESSIONID='+$sessionId, {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
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
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            const collections = await response.json();
        }

        const interval = setInterval(async () => {
            checkJobs().then(res => jobs = res);
            console.log('jobs:')
            console.log(await jobs)
            await jobs.forEach((job) => {
                if (job.docId === selectedDoc.docId && job.state !== "FINISHED" ) {
                    console.log("selected doc is processing");
                    reloadJob = job.jobId;
                } else if (job.jobId === reloadJob && job.state === "FINISHED") {
                    console.log("reloading xml!");
                    getDocXml(selectedDoc.docId, 1).then(res => docXML = res);
                }
            });
        }, 10000);
        //console.log(collections);
    });

    const fetchDocs = async (id) => {
        console.log('running fetchDocs')
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/collections/${id}/list?JSESSIONID=${$sessionId}`, {
        method: 'GET',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
        });
        const data = await res.json();
        console.log(data);
        return data;
    }

    const fetchFull = async (id) => {
        console.log("run fetchFull");
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/collections/${selectedCol.colId}/${id}/fulldoc?JSESSIONID=${$sessionId}`, {
            method: 'GET',
        });
        const data = await res.json();
        console.log(data);
        return data;
    }

    $: if (selectedCol) {fetchDocs(selectedCol.colId).then(res => docs = res);}
    $: if (selectedDoc) {
        fetchFull(selectedDoc.docId).then(res => fullDoc = res);
        getDocXml(selectedDoc.docId, 1).then(res => docXML = res);
    }

    const startLA = async (id) => {
        let pagelist;
        fullDoc.pageList.pages.forEach(page => pagelist += "<pages><pageId>"+page.pageId+"</pageId></pages>");
        console.log(pagelist);
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/LA?collId=${selectedCol.colId}&doBlockSeg=true&doLineSeg=true&doWordSeg=false&jobImpl=CITlabAdvancedLaJob&doCreateJobBatch=false&JSESSIONID=${$sessionId}`, {
            method: 'POST',
            headers: {
                'content-type': 'application/xml',
            },
            /*body: {
                    docList: {
                        docs: [ {
                            docId: id,
                            pageList: {
                                pages: [ {
                                    pageId: 19719563,
                                }]
                            }
                        } ]
                }
            }*/
            body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><jobParameters><docList><docs><docId>${id}</docId><pageList>${pagelist}</pageList></docs></docList><params/></jobParameters>`
        });
        const data = await res.text();
        const jobId = data.substring(data.indexOf('<jobId>')+7,data.indexOf('</jobId>'));
        console.log(data);
        if (res.status === 200) {
            statusLA = getJob(jobId)
            return true;
        } else {
            return res.status;
        }
    };

    const checkJobs = async () => {
        console.log("run checkJobs");
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/jobs/list?JSESSIONID=${$sessionId}`, {
            method: 'GET',
        });
        const data = await res.json();
        console.log(data);
        return data;
    }

    const getJob = async (id) => {
        console.log("run getJob");
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/jobs/${id}?JSESSIONID=${$sessionId}`, {
            method: 'GET',
        });
        const data = await res.json();
        console.log(data);
        return data;
    }

    const getDocXml = async (id, page) => {
        console.log("run getDocXml");
        const res = await fetch(`https://transkribus.eu/TrpServer/rest/collections/${selectedCol.colId}/${id}/${page}/list?JSESSIONID=${$sessionId}`, {
            method: 'GET',
        });
        console.log('data:');
        const data = await res.json();
        console.log(data)
        const xmlRes = await fetch(data[0].url);
        const xml = await xmlRes.text();
        console.log('xml:')
        console.log(xml)
        return xml;
    }
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
{#if selectedDoc}
    <button on:click="{() => startLA(selectedDoc.docId)}">start Layout analysis</button>
    Status: {statusLA}
{/if}
{#await docXML then data}
    {docXML}
{/await}

{#await jobs then jobList}
    <h2>Jobs</h2>
    <ul>
    {#each jobList as job}
        <li>{job.jobId}: {job.description}<button on:click={() => console.log(getJob(job.jobId))}>get job</button></li>
    {/each}
    </ul>
{/await}