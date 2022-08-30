<script>
    import { page } from "$app/stores";
    import { iso6393 } from "iso-639-3";
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<h1>User: {data.username}</h1>

<ul>
    <li>Geohash: {data.geohash}</li>
    <li>Voice type: {data.voiceType}</li>
    <li>Native languages: {data.nativeLanguages.map(l => iso6393.find(i => i.iso6393 === l)?.name)}</li>
</ul>