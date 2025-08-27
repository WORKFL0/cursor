import { NextRequest } from 'next/server';
import { uptimeMonitor } from '@/lib/monitoring/uptime-monitor';

export async function GET(request: NextRequest) {
  try {
    // Generate Prometheus-style metrics
    const prometheusMetrics = uptimeMonitor.generatePrometheusMetrics();
    
    return new Response(prometheusMetrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    
    return new Response('Error generating metrics', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}