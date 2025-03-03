<script lang="ts">
  import {
    tags as CodeForcesTags,
    problems as CodeForcesProblems,
    type TProblem,
    type TProblemStatistic,
    problemStats,
  } from "@/api/codeforces";
  import EnumFilter from "@/components/enum-filter.svelte";
  import Badge from "@/components/ui/badge/badge.svelte";
  import { Button } from "@/components/ui/button";
  import { Label } from "@/components/ui/label";
  import { Slider } from "@/components/ui/slider";
  import Shuffle from "lucide-svelte/icons/shuffle";
  import { get } from "svelte/store";

  let codeForcesFilterValues = $state<string[]>([]);
  let codeForcesRating = $state([800, 3500]);
  let currentProblem = $state<TProblem>();
  let currentProblemStat = $state<TProblemStatistic>();

  function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function getRandomProblem(
    topics: Array<string>,
    ratings: { min: number; max: number }
  ): TProblem {
    let filteredProblems: Array<TProblem> = [];

    for (const val of get(CodeForcesProblems)) {
      if (!topics.length || topics.some((_) => val.tags.includes(_))) {
        if (!val.rating) val.rating = ratings.min;

        if (val.rating >= ratings.min && val.rating <= ratings.max)
          filteredProblems = filteredProblems.concat(val);
      }
    }

    if (filteredProblems.length === 0)
      throw new Error(
        `No problems found for the entered combination. Try another combination.`
      );

    const prob: TProblem =
      filteredProblems[getRandomInt(filteredProblems.length)];
    return prob;
  }

  const randomProb = () => {
    const prob = getRandomProblem(codeForcesFilterValues, {
      min: codeForcesRating[0],
      max: codeForcesRating[1],
    });
    currentProblem = undefined;
    currentProblemStat = undefined;
    if (!prob) return;
    const stat = $problemStats.find(
      ({ index, contestId }) =>
        index === prob.index && contestId === prob.contestId
    );
    currentProblem = prob;
    currentProblemStat = stat;
  };
</script>

<div class="container py-5">
  <div class="space-y-2">
    <h2 class="font-bold text-3xl">สุ่มโจทย์ CodeForces</h2>

    <div class="flex gap-4">
      <div class="flex flex-col gap-1.5 w-64">
        <Label>Ratings [{codeForcesRating}]</Label>
        <Slider
          type="multiple"
          bind:value={codeForcesRating}
          max={4000}
          min={500}
          step={100}
        />
      </div>
      <EnumFilter
        title="Tags"
        items={$CodeForcesTags}
        bind:filterValues={codeForcesFilterValues}
      />
      <Button onclick={randomProb}>
        <Shuffle />
        สุ่มโจทย์
      </Button>
    </div>
    <div class="grid grid-cols-2 gap-5">
      {#if currentProblem}
        <a
          target="_blank"
          href="https://codeforces.com/problemset/problem/{currentProblem.contestId}/{currentProblem.index}"
        >
          <div class="rounded bg-secondary hover:bg-secondary/50 border-2 p-2">
            <h3 class="font-bold text-lg">
              {currentProblem.name}
            </h3>
            <div>
              <p>Rating: {currentProblem.rating.toLocaleString()}</p>
              <p>Solved: {currentProblemStat?.solvedCount.toLocaleString()}</p>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              {#each currentProblem.tags as tag}
                <Badge>
                  {tag}
                </Badge>
              {/each}
            </div>
          </div>
        </a>
      {/if}
    </div>
  </div>
</div>
