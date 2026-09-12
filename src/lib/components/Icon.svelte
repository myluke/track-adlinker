<script lang="ts">
  const paths = {
    'arrow-up-right': 'M7 17 17 7M7 7h10v10',
    check: 'm5 12 4 4L19 6',
    grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    waves: 'M3 6c3-4 6 4 9 0s6 4 9 0M3 12c3-4 6 4 9 0s6 4 9 0M3 18c3-4 6 4 9 0s6 4 9 0',
    undo: 'm8 3-5 5 5 5M3 8h11a7 7 0 0 1 0 14',
    chart: 'M4 3v17h17M8 16v-5M13 16V7M18 16V4',
    diamond: 'm12 3 9 9-9 9-9-9Z',
    document: 'M5 3h14v18H5zM8 7h8M8 12h8M8 17h5',
    plus: 'M12 5v14M5 12h14',
    equal: 'M5 8h14M5 16h14',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    refresh: 'M3 11a9 9 0 1 1 2.6 7.4M3 4v7h7',
    close: 'm6 6 12 12M6 18 18 6',
    'chevron-down': 'm6 9 6 6 6-6'
  };
  let { name }: { name: keyof typeof paths } = $props();
</script>

<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={paths[name]} /></svg>
