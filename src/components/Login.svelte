<script>

    let user;
    let pw;
    /*
        const loginTrans = async (user, pw) => {
            const response = await fetch('https://transkribus.eu/TrpServer/rest/auth/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Access-Control-Allow-Origin': '*'

                },
                body: 'user='+user+'&pw='+pw
            });
            const data = await response.text();
            const id = await data.substring(data.indexOf('<sessionId>')+11,data.indexOf('</sessionId>'));
            //console.log(id)
            sessionId.set(id);
            console.log($sessionId);
            return id;
        }*/
</script>

<div class="login">
    <input type="text" bind:value={user}>
    <input type="password" bind:value={pw}>
    <button on:click={() => loginTrans(user,pw)}>login</button>
</div>