<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    export let data: {
      engagement: Array<{ artist_id: number; hour: number; day_of_week: number; total_engagement: number }>;
    };
    export let selectedArtistId: number;

    let hourlyChartCanvas: HTMLCanvasElement;
    let hourlyChart: Chart;
  
    $: selectedArtistData = data.engagement.filter(
      (point) => point.artist_id === selectedArtistId
    );
  
    $: hourlyChartData = {
      labels: Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00'),
      datasets: [
        {
          label: 'Weekday Engagement',
          data: Array.from({ length: 24 }, (_, i) => {
            const points = selectedArtistData.filter((p) => p.hour === i && p.day_of_week >= 1 && p.day_of_week <= 5);
            return points.reduce((sum, p) => sum + p.total_engagement, 0) / 5;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 3,
          lineTension: 0.4,

        },
        {
          label: 'Weekend Engagement',
          data: Array.from({ length: 24 }, (_, i) => {
            const points = selectedArtistData.filter((p) => p.hour === i && (p.day_of_week === 0 || p.day_of_week === 6));
            return points.reduce((sum, p) => sum + p.total_engagement, 0) / 2;
          }),
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          borderColor: 'rgb(255, 159, 64)',
          borderWidth: 3,
          lineTension: 0.4,

        },
      ],
    };
  
    onMount(() => {
      hourlyChart = new Chart(hourlyChartCanvas, {
        type: 'line',
        data: hourlyChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Average Engagement',
              },
            },
            x: {
              title: {
                display: true,
                text: 'Hour of Day',
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Hourly Engagement Pattern',
            },
          },
        },
      });
  
      return () => {
        if (hourlyChart) {
          hourlyChart.destroy();
        }
      };
    });
  
    $: if (hourlyChart && hourlyChart.data.datasets) {
      hourlyChart.data.datasets[0].data = hourlyChartData.datasets[0].data;
      hourlyChart.data.datasets[1].data = hourlyChartData.datasets[1].data;
      hourlyChart.update();
    }
  </script>
  
  <div class="w-full h-80">
    <canvas bind:this={hourlyChartCanvas} />
  </div>