<script lang="ts">
  import { onMount } from "svelte";
  import "../app.css";
  import { getCodeForcesProblemSet } from "@/api/codeforces";
  let { children } = $props();

  onMount(async () => {
    getCodeForcesProblemSet();
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&display=swap"
    rel="stylesheet"
  />

  <title>สุ่มโจทย์ Programming</title>
</svelte:head>

<div class="bg-background">
  {@render children()}
</div>
