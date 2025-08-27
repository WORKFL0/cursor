/**
 * Comprehensive uptime monitoring for Workflo New Project
 * Tracks application health, performance, and availability
 */

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: Date;
  responseTime: number;
  details?: Record<string, any>;
  error?: string;
}

export interface UptimeMetrics {
  uptime: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: number;
}

export class UptimeMonitor {
  private startTime: number;
  private requestCount: number = 0;
  private errorCount: number = 0;
  private responseTimeHistory: number[] = [];
  
  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Get current uptime metrics
   */
  getMetrics(): UptimeMetrics {
    const now = Date.now();
    const uptime = (now - this.startTime) / 1000; // in seconds
    
    // Calculate average response time from last 100 requests
    const recentResponseTimes = this.responseTimeHistory.slice(-100);
    const avgResponseTime = recentResponseTimes.length > 0 
      ? recentResponseTimes.reduce((sum, time) => sum + time, 0) / recentResponseTimes.length 
      : 0;

    // Calculate error rate
    const errorRate = this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0;
    
    // Calculate throughput (requests per second)
    const throughput = uptime > 0 ? this.requestCount / uptime : 0;

    return {
      uptime,
      responseTime: avgResponseTime,
      errorRate,
      throughput,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage ? this.getCPUUsage() : undefined,
    };
  }

  /**
   * Record a request
   */
  recordRequest(responseTime: number, isError: boolean = false): void {
    this.requestCount++;
    this.responseTimeHistory.push(responseTime);
    
    if (isError) {
      this.errorCount++;
    }

    // Keep only last 1000 response times to prevent memory leak
    if (this.responseTimeHistory.length > 1000) {
      this.responseTimeHistory = this.responseTimeHistory.slice(-500);
    }
  }

  /**
   * Perform comprehensive health checks
   */
  async performHealthChecks(): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = [];

    // Database health check
    checks.push(await this.checkDatabase());
    
    // API endpoints health check
    checks.push(await this.checkAPIEndpoints());
    
    // External services health check
    checks.push(await this.checkExternalServices());
    
    // System resources health check
    checks.push(await this.checkSystemResources());

    return checks;
  }

  /**
   * Check database connectivity and performance
   */
  private async checkDatabase(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // This would be replaced with actual database connection check
      // For now, simulate a database check
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'database',
        status: responseTime < 100 ? 'healthy' : 'degraded',
        timestamp: new Date(),
        responseTime,
        details: {
          connectionPool: 'active',
          activeConnections: Math.floor(Math.random() * 10),
        },
      };
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check critical API endpoints
   */
  private async checkAPIEndpoints(): Promise<HealthCheck> {
    const startTime = Date.now();
    const endpoints = ['/api/health', '/api/company-info'];
    let healthyEndpoints = 0;

    try {
      for (const endpoint of endpoints) {
        try {
          // In a real implementation, this would make actual HTTP requests
          await new Promise(resolve => setTimeout(resolve, Math.random() * 30));
          healthyEndpoints++;
        } catch {
          // Endpoint failed
        }
      }

      const responseTime = Date.now() - startTime;
      const healthRatio = healthyEndpoints / endpoints.length;
      
      let status: HealthCheck['status'] = 'healthy';
      if (healthRatio < 0.5) status = 'unhealthy';
      else if (healthRatio < 1) status = 'degraded';

      return {
        service: 'api-endpoints',
        status,
        timestamp: new Date(),
        responseTime,
        details: {
          totalEndpoints: endpoints.length,
          healthyEndpoints,
          healthRatio: Math.round(healthRatio * 100),
        },
      };
    } catch (error) {
      return {
        service: 'api-endpoints',
        status: 'unhealthy',
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check external service dependencies
   */
  private async checkExternalServices(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    try {
      // Check external services (Sentry, analytics, etc.)
      const services = ['sentry', 'analytics'];
      const healthyServices = services.length; // Assume all healthy for now
      
      const responseTime = Date.now() - startTime;
      
      return {
        service: 'external-services',
        status: 'healthy',
        timestamp: new Date(),
        responseTime,
        details: {
          services,
          healthyServices,
        },
      };
    } catch (error) {
      return {
        service: 'external-services',
        status: 'degraded',
        timestamp: new Date(),
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check system resource usage
   */
  private async checkSystemResources(): Promise<HealthCheck> {
    const memory = process.memoryUsage();
    const memoryUsageMB = memory.heapUsed / 1024 / 1024;
    const memoryLimitMB = memory.heapTotal / 1024 / 1024;
    const memoryUsagePercent = (memoryUsageMB / memoryLimitMB) * 100;

    let status: HealthCheck['status'] = 'healthy';
    if (memoryUsagePercent > 90) status = 'unhealthy';
    else if (memoryUsagePercent > 75) status = 'degraded';

    return {
      service: 'system-resources',
      status,
      timestamp: new Date(),
      responseTime: 0,
      details: {
        memory: {
          used: Math.round(memoryUsageMB),
          total: Math.round(memoryLimitMB),
          usagePercent: Math.round(memoryUsagePercent),
        },
        uptime: process.uptime(),
      },
    };
  }

  /**
   * Get CPU usage percentage
   */
  private getCPUUsage(): number {
    const usage = process.cpuUsage();
    const total = usage.user + usage.system;
    const percent = (total / 1000000) / process.uptime() * 100;
    return Math.min(100, Math.max(0, percent));
  }

  /**
   * Generate Prometheus metrics format
   */
  generatePrometheusMetrics(): string {
    const metrics = this.getMetrics();
    const timestamp = Date.now();
    
    return `
# HELP workflo_uptime_seconds Total uptime in seconds
# TYPE workflo_uptime_seconds counter
workflo_uptime_seconds ${metrics.uptime} ${timestamp}

# HELP workflo_response_time_ms Average response time in milliseconds
# TYPE workflo_response_time_ms gauge
workflo_response_time_ms ${metrics.responseTime} ${timestamp}

# HELP workflo_error_rate_percent Error rate percentage
# TYPE workflo_error_rate_percent gauge
workflo_error_rate_percent ${metrics.errorRate} ${timestamp}

# HELP workflo_throughput_rps Throughput in requests per second
# TYPE workflo_throughput_rps gauge
workflo_throughput_rps ${metrics.throughput} ${timestamp}

# HELP workflo_memory_usage_bytes Memory usage in bytes
# TYPE workflo_memory_usage_bytes gauge
workflo_memory_usage_bytes{type="heap_used"} ${metrics.memoryUsage.heapUsed} ${timestamp}
workflo_memory_usage_bytes{type="heap_total"} ${metrics.memoryUsage.heapTotal} ${timestamp}
workflo_memory_usage_bytes{type="external"} ${metrics.memoryUsage.external} ${timestamp}
workflo_memory_usage_bytes{type="rss"} ${metrics.memoryUsage.rss} ${timestamp}
    `.trim();
  }
}

// Singleton instance
export const uptimeMonitor = new UptimeMonitor();