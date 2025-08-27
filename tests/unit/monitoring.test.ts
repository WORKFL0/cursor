/**
 * Unit tests for monitoring system
 */

import { UptimeMonitor } from '@/lib/monitoring/uptime-monitor';

describe('UptimeMonitor', () => {
  let monitor: UptimeMonitor;

  beforeEach(() => {
    monitor = new UptimeMonitor();
  });

  describe('getMetrics', () => {
    it('should return initial metrics', () => {
      const metrics = monitor.getMetrics();
      
      expect(metrics).toHaveProperty('uptime');
      expect(metrics).toHaveProperty('responseTime');
      expect(metrics).toHaveProperty('errorRate');
      expect(metrics).toHaveProperty('throughput');
      expect(metrics).toHaveProperty('memoryUsage');
      
      expect(typeof metrics.uptime).toBe('number');
      expect(metrics.uptime).toBeGreaterThanOrEqual(0);
      expect(metrics.errorRate).toBe(0);
      expect(metrics.throughput).toBe(0);
    });
  });

  describe('recordRequest', () => {
    it('should record successful requests', () => {
      monitor.recordRequest(100, false);
      
      const metrics = monitor.getMetrics();
      expect(metrics.responseTime).toBe(100);
      expect(metrics.errorRate).toBe(0);
      expect(metrics.throughput).toBeGreaterThan(0);
    });

    it('should record error requests', () => {
      monitor.recordRequest(200, true);
      
      const metrics = monitor.getMetrics();
      expect(metrics.responseTime).toBe(200);
      expect(metrics.errorRate).toBe(100);
    });

    it('should calculate average response time', () => {
      monitor.recordRequest(100, false);
      monitor.recordRequest(200, false);
      
      const metrics = monitor.getMetrics();
      expect(metrics.responseTime).toBe(150);
    });

    it('should calculate error rate correctly', () => {
      monitor.recordRequest(100, false);
      monitor.recordRequest(150, true);
      monitor.recordRequest(120, false);
      
      const metrics = monitor.getMetrics();
      expect(metrics.errorRate).toBeCloseTo(33.33, 2);
    });
  });

  describe('performHealthChecks', () => {
    it('should perform all health checks', async () => {
      const healthChecks = await monitor.performHealthChecks();
      
      expect(Array.isArray(healthChecks)).toBe(true);
      expect(healthChecks.length).toBeGreaterThan(0);
      
      healthChecks.forEach(check => {
        expect(check).toHaveProperty('service');
        expect(check).toHaveProperty('status');
        expect(check).toHaveProperty('timestamp');
        expect(check).toHaveProperty('responseTime');
        expect(['healthy', 'degraded', 'unhealthy']).toContain(check.status);
      });
    });
  });

  describe('generatePrometheusMetrics', () => {
    it('should generate valid Prometheus metrics', () => {
      monitor.recordRequest(100, false);
      
      const metrics = monitor.generatePrometheusMetrics();
      
      expect(typeof metrics).toBe('string');
      expect(metrics).toContain('workflo_uptime_seconds');
      expect(metrics).toContain('workflo_response_time_ms');
      expect(metrics).toContain('workflo_error_rate_percent');
      expect(metrics).toContain('workflo_throughput_rps');
      expect(metrics).toContain('workflo_memory_usage_bytes');
    });
  });
});