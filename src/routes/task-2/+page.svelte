<script lang="ts">
  import HourlyEngagementChart from '$lib/components/hourlyEngagementChart.svelte';
  import DailyEngagementChart from '$lib/components/dailyEngagementChart.svelte';

  export let data: {
    artists: Array<{ id: number; name: string }>;
    engagement: Array<{ artist_id: number; hour: number; day_of_week: number; total_engagement: number }>;
  };

  let selectedArtistId: number;

  // Set default selected artist when data is available
  $: if (data.artists.length > 0 && !selectedArtistId) {
    selectedArtistId = data.artists[0].id;  // Set to the first artist's id by default
  }

  function getSelectedArtistName() {
    return data.artists.find((artist) => artist.id === selectedArtistId)?.name || 'Unknown Artist';
  }
</script>

<div class="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 p-4">
  <div class="w-full max-w-6xl p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4 text-center text-gray-800">
      Artist Engagement Analysis
    </h1>
    <div class="mb-4">
      <label for="artist-select" class="block text-sm font-medium text-gray-700">
        Select an artist:
      </label>
      <select
        id="artist-select"
        bind:value={selectedArtistId}
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {#each data.artists as artist}
          <option value={artist.id}>{artist.name}</option>
        {/each}
      </select>
    </div>
    <p class="text-center text-lg font-semibold mb-4">
      Showing data for: {getSelectedArtistName()}
    </p>
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
      <HourlyEngagementChart {data} {selectedArtistId} />
      <DailyEngagementChart {data} {selectedArtistId} />
    </div>
  </div>
</div>
