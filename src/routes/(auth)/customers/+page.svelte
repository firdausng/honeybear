<script lang="ts">
    let { data } = $props();
</script>

<h1>Hello</h1>
<pre>
    {JSON.stringify(data.activeUser, null, 2)}
</pre>
