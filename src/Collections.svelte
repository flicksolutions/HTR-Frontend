<script>
    import {token, authenticated, URL} from './_store';
    import {onMount} from 'svelte';
    import "smelte/src/tailwind.css" ;
    import Button from "smelte/src/components/Button";
    import Select from "smelte/src/components/Select";

    let collections = [];
    let selectedCol;
    let selectedDoc;
    let docs;
    let statusLA;
    let jobs = new Promise(() => {
    });
    let docXML = new Promise(() => {
    });
    let fullDoc;
    let reloadJob;
    export let keycloak;
    onMount(async () => {
        console.log('running collections onmount')
        let response = await fetch(`${URL}/rest/collections/list`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        let data;
        if (response.status === 200) {
            console.log('status was 200, no need to refresh the session');
            for (let item of await response.json()){
                collections = [...collections, {value: item, text: item.colName}];
            }
        } else {
            console.log('session needs to be refreshed!')
            //fetch(`auth.json`).then(res => res.json()).then(json => sessionId.set(json.sessionId));
            response = await fetch(`${URL}/rest/collections/list`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + keycloak.token
                }
            });
            for (let item of await response.json()){
                collections = [...collections, {value: item, text: item.colName}];
            }

        }
        const interval = setInterval(async () => {
            checkJobs().then(res => jobs = res);
            console.log('jobs:')
            console.log(await jobs)
            if (selectedDoc) {
                await jobs.forEach((job) => {
                    if (job.docId === selectedDoc.docId && job.state !== "FINISHED") {
                        console.log("selected doc is processing");
                        reloadJob = job.jobId;
                    } else if (job.jobId === reloadJob && job.state === "FINISHED") {
                        console.log("reloading xml!");
                        getDocXml(selectedDoc.docId, 1).then(res => docXML = res);
                        reloadJob = null;
                    }
                });
            }
        }, 5000);
    });
    const fetchDocs = async (id) => {
        console.log('running fetchDocs')
        let data = [];
        const res = await fetch(`${URL}/rest/collections/${id}/list`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        for (let item of await res.json()){
           data = [...data, {value: item, text: item.title}]
        }
        console.log(data);
        return data;
    }
    const fetchFull = async (id) => {
        console.log("run fetchFull");
        const res = await fetch(`${URL}/rest/collections/${selectedCol.colId}/${id}/fulldoc`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const data = await res.json();
        console.log(data);
        console.log('fetchdata above')
        return data;
    }
    const startLA = async (id) => {
        let pagelist;
        fullDoc.pageList.pages.forEach(page => pagelist += "<pages><pageId>" + page.pageId + "</pageId></pages>");
        console.log(pagelist);
        const res = await fetch(`${URL}/rest/LA?collId=${selectedCol.colId}&doBlockSeg=true&doLineSeg=true&doWordSeg=false&jobImpl=CITlabAdvancedLaJob&doCreateJobBatch=false`, {
            method: 'POST',
            headers: {
                'content-type': 'application/xml; charset=UTF-8',
                'Authorization': 'Bearer ' + keycloak.token
            },
            body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><jobParameters><docList><docs><docId>${id}</docId><pageList>${pagelist}</pageList></docs></docList><params/></jobParameters>`
        });
        const data = await res.text();
        const jobId = data.substring(data.indexOf('<jobId>') + 7, data.indexOf('</jobId>'));
        console.log(data);
        if (res.status === 200) {
            statusLA = getJob(jobId)
            return true;
        } else {
            return res.status;
        }
    };
    const startHTR = async (id) => {
        let pagelist;
        fullDoc.pageList.pages.forEach(page => pagelist += "<pages><pageId>" + page.pageId + "</pageId></pages>");
        //the ID of the model is just some model up there which will likely not be a good one...19829 for live server
        const res = await fetch(`${URL}/rest/recognition/${selectedCol.colId}/1161/htrCITlab?pages=1-${fullDoc.pageList.pages.length}&id=${id}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const data = await res.json();
        console.log(data);
        if (res.status === 200) {
            statusLA = getJob(id)
            return true;
        } else {
            return res.status;
        }
    };
    const checkJobs = async () => {
        console.log("run checkJobs");
        const res = await fetch(`${URL}/rest/jobs/list`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const data = await res.json();
        console.log(data);
        return data;
    }
    const getJob = async (id) => {
        console.log("run getJob");
        const res = await fetch(`${URL}/rest/jobs/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        const data = await res.json();
        console.log(data);
        return data;
    }
    const getDocXml = async (id, page) => {
        console.log("run getDocXml");
        const res = await fetch(`${URL}/rest/collections/${selectedCol.colId}/${id}/${page}/list`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + keycloak.token
            }
        });
        console.log('data:');
        const data = await res.json();
        console.log(data)
        return data[0].url;
    }
    $: if (selectedCol) {
        fetchDocs(selectedCol.colId).then(res => docs = res);
    }
    $: if (selectedDoc) {
        fetchFull(selectedDoc.docId).then(res => fullDoc = res);
        getDocXml(selectedDoc.docId, 1).then(res => docXML = res);
    }
</script>
<div className="container grid grid-cols-2">
    {#if collections.length}
        <h2>Collection wählen:</h2>
        <Select label="collection" items={collections} bind:value={selectedCol}/>
    {/if}
    {#if docs}
        <h2>Dokument wählen:</h2>
        <Select label="document" items={docs} bind:value={selectedDoc}/>
    {/if}
    {#if selectedDoc}
        {#if fullDoc}<img src="{fullDoc.md.url}" alt="bild des dokuments" class="col-span-full max-w-full"/>{/if}
        <Button on:click="{() => startLA(selectedDoc.docId)}">start Layout analysis</Button>
        <Button on:click={() => startHTR(selectedDoc.docId)}>start HTR</Button>
        Status: {statusLA}
    {/if}
    {#await docXML then data}
        <div class="download">
            <p>Download XML:</p>
            {#if fullDoc}
                {#each fullDoc.pageList.pages as page, i}
                    {#await getDocXml(selectedDoc.docId, i + 1) then link}
                        <a href="{link}">Seite {i + 1}</a>
                    {/await}
                {/each}
            {/if}
        </div>
    {/await}

    {#await jobs then jobList}
        <div class="joblist">
            <h2>Jobs</h2>
            <ul>
                {#each jobList as job}
                    <li>{job.jobId}: {job.description}
                        <Button on:click={() => console.log(getJob(job.jobId))}>get job</Button>
                    </li>
                {:else}
                    <li>no job in List!</li>
                {/each}
            </ul>
        </div>
    {/await}
</div>
