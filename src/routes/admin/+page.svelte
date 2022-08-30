<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

{#each data.allPronunciations as item}
    <div style="margin: 20px; border: 1px solid black">
        <span>Language: {item.word.language}</span>
        <span>Word: {item.word.word}</span>
        <span>Author: {item.author.username}</span>
        <span>Created At: {item.createdAt}</span>
        <span>Flagged: {item.flagged}</span>
        <span>Votes: {item.votes.toString()}</span>
    </div>
{:else}
    <p>No pronunciations found for this language.</p>
{/each}
