<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let data: {
      engagement: Array<{ artist_id: number; hour: number; day_of_week: number; total_engagement: number }>;
    };
    export let selectedArtistId: number;
  
    let dailyChartCanvas: HTMLCanvasElement;
    let dailyChart: Chart;
  
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    $: selectedArtistData = data.engagement.filter(
      (point) => point.artist_id === selectedArtistId
    );
  
    $: dailyChartData = {
      labels: daysOfWeek,
      datasets: [{
        label: 'Daily Engagement',
        data: daysOfWeek.map((_, i) => {
          const points = selectedArtistData.filter((p) => p.day_of_week === i);
          return points.reduce((sum, p) => sum + p.total_engagement, 0);
        }),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgb(153, 102, 255)',
        borderWidth: 1,
      }],
    };
  
    onMount(() => {
      dailyChart = new Chart(dailyChartCanvas, {
        type: 'bar',
        data: dailyChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Engagement',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Day of Week',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Daily Engagement Pattern',
            },
          },
        },
      });
    });
  
    $: if (dailyChart) {
      dailyChart.data = dailyChartData;
      dailyChart.update();
    }
  </script>
  
  <div class="w-full h-80">
    <canvas bind:this={dailyChartCanvas} />
  </div>
  