<script lang="ts">
  let {
    title,
    items = [],
    filterValues = $bindable<string[]>([]),
  }: { title: string; items: string[]; filterValues: string[] } = $props();

  import { Button } from "@/components/ui/button";
  import CirclePlus from "lucide-svelte/icons/circle-plus";
  import Check from "lucide-svelte/icons/check";
  import * as Popover from "$lib/components/ui/popover";
  import * as Command from "$lib/components/ui/command";
  import { cn } from "@/utils";
  import { Separator } from "./ui/separator";
  import { Badge } from "./ui/badge";

  function handleSelect(currentValue: string) {
    if (Array.isArray(filterValues) && filterValues.includes(currentValue)) {
      filterValues = filterValues.filter((v) => v !== currentValue);
    } else {
      filterValues = [
        ...(Array.isArray(filterValues) ? filterValues : []),
        currentValue,
      ];
    }
  }
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props}>
        <CirclePlus />
        {title}

        {#if filterValues.length > 0}
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {filterValues.length}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            {#if filterValues.length > 3}
              <Badge variant="secondary" class="font-normal">
                {filterValues.length} Selected
              </Badge>
            {:else}
              {#each filterValues as option}
                <Badge variant="secondary" class="capitalize font-normal">
                  {option}
                </Badge>
              {/each}
            {/if}
          </div>
        {/if}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="p-0">
    <Command.Root>
      <Command.Input placeholder="ค้นหา" />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        {#each items as item}
          <Command.Item
            onSelect={() => {
              handleSelect(item);
            }}
            class="capitalize"
            value={item}
          >
            <div
              class={cn(
                "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                filterValues.includes(item)
                  ? "bg-primary text-primary-foreground"
                  : "opacity-50 [&_svg]:invisible"
              )}
            >
              <Check className={cn("h-4 w-4")} />
            </div>
            {item}
          </Command.Item>
        {/each}
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
