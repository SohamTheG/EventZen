import json
import os

print("📊 Reading report.json and generating advanced graph...")
try:
    with open("report.json", "r") as f:
        data = json.load(f)

    intermediates = data.get("intermediate", [])
    
    labels = []
    p50_data = []
    p95_data = []
    p99_data = []
    requests_data = []
    success_data = []
    
    for i, block in enumerate(intermediates):
        # Time window label
        labels.append(f"T + {i*10}s")
        
        # Extract Counters
        counters = block.get("counters", {})
        requests_data.append(counters.get("http.requests", 0))
        success_data.append(counters.get("http.codes.200", 0))
        
        # Extract Latencies
        summaries = block.get("summaries", {})
        resp_time = summaries.get("http.response_time", {})
        p50_data.append(resp_time.get("p50", 0))
        p95_data.append(resp_time.get("p95", 0))
        p99_data.append(resp_time.get("p99", 0))

    # Complex Chart.js HTML Generation
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Comprehensive System Load Analysis</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {{ font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #1e1e2f; color: #ffffff; padding: 40px; margin: 0; }}
            .chart-wrapper {{ background: #27293d; padding: 30px; border-radius: 12px; box-shadow: 0px 10px 30px rgba(0,0,0,0.5); max-width: 1200px; margin: auto; }}
            h1 {{ text-align: center; color: #e1e1e1; font-weight: 300; margin-bottom: 5px; }}
            p.subtitle {{ text-align: center; color: #9a9a9a; margin-bottom: 30px; }}
        </style>
    </head>
    <body>
        <div class="chart-wrapper">
            <h1>Scenario 3: Asynchronous Ingestion Telemetry</h1>
            <p class="subtitle">Concurrent Traffic vs. System Latency (RabbitMQ Resilience)</p>
            <canvas id="complexChart"></canvas>
        </div>
        <script>
            const ctx = document.getElementById('complexChart').getContext('2d');
            new Chart(ctx, {{
                type: 'bar',
                data: {{
                    labels: {labels},
                    datasets: [
                        {{
                            type: 'line',
                            label: 'P99 Latency (ms)',
                            data: {p99_data},
                            borderColor: '#ff6384',
                            backgroundColor: '#ff6384',
                            borderWidth: 3,
                            tension: 0.4,
                            yAxisID: 'y-latency'
                        }},
                        {{
                            type: 'line',
                            label: 'P95 Latency (ms)',
                            data: {p95_data},
                            borderColor: '#ffce56',
                            backgroundColor: '#ffce56',
                            borderWidth: 3,
                            tension: 0.4,
                            yAxisID: 'y-latency'
                        }},
                        {{
                            type: 'line',
                            label: 'Median Latency (p50 ms)',
                            data: {p50_data},
                            borderColor: '#4bc0c0',
                            backgroundColor: '#4bc0c0',
                            borderWidth: 3,
                            tension: 0.4,
                            yAxisID: 'y-latency'
                        }},
                        {{
                            type: 'bar',
                            label: 'Incoming Requests',
                            data: {requests_data},
                            backgroundColor: 'rgba(54, 162, 235, 0.8)',
                            yAxisID: 'y-throughput'
                        }},
                        {{
                            type: 'bar',
                            label: 'Successful Responses (200 OK)',
                            data: {success_data},
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            yAxisID: 'y-throughput'
                        }}
                    ]
                }},
                options: {{
                    responsive: true,
                    interaction: {{ mode: 'index', intersect: false }},
                    plugins: {{
                        tooltip: {{ backgroundColor: 'rgba(0,0,0,0.8)', titleFont: {{size: 14}}, bodyFont: {{size: 13}}, padding: 12 }},
                        legend: {{ labels: {{ color: '#e1e1e1', font: {{size: 13}} }} }}
                    }},
                    scales: {{
                        x: {{ 
                            ticks: {{ color: '#9a9a9a' }},
                            grid: {{ color: 'rgba(255,255,255,0.05)' }}
                        }},
                        'y-latency': {{
                            type: 'linear',
                            position: 'left',
                            title: {{ display: true, text: 'Latency (Milliseconds)', color: '#ffce56' }},
                            ticks: {{ color: '#9a9a9a' }},
                            grid: {{ color: 'rgba(255,255,255,0.05)' }}
                        }},
                        'y-throughput': {{
                            type: 'linear',
                            position: 'right',
                            title: {{ display: true, text: 'Throughput (Count)', color: '#36a2eb' }},
                            ticks: {{ color: '#9a9a9a' }},
                            grid: {{ display: false }}
                        }}
                    }}
                }}
            }});
        </script>
    </body>
    </html>
    """

    with open("graph_advanced.html", "w", encoding="utf-8") as f:
        f.write(html_content)

    print("✅ Successfully created graph_advanced.html!")
    os.system("start graph_advanced.html")

except Exception as e:
    print("❌ Failed:", e)
