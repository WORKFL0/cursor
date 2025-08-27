#!/bin/bash

# Health Check Script for Workflo New Project
# Performs comprehensive health checks across all services

set -e

# Configuration
APP_URL="${APP_URL:-http://localhost:3000}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-postgres}"
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Health check functions
check_application() {
    log "Checking application health..."
    
    if curl -sf "$APP_URL/api/health" > /dev/null; then
        log "✅ Application is responding"
        
        # Check detailed health
        HEALTH_RESPONSE=$(curl -s "$APP_URL/api/health" | jq -r '.status // "unknown"')
        case $HEALTH_RESPONSE in
            "healthy")
                log "✅ Application status: healthy"
                return 0
                ;;
            "degraded")
                warn "⚠️ Application status: degraded"
                return 1
                ;;
            "unhealthy")
                error "❌ Application status: unhealthy"
                return 2
                ;;
            *)
                warn "⚠️ Application status: unknown"
                return 1
                ;;
        esac
    else
        error "❌ Application is not responding"
        return 2
    fi
}

check_database() {
    log "Checking database connectivity..."
    
    if command -v pg_isready &> /dev/null; then
        if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -q; then
            log "✅ Database is accepting connections"
            return 0
        else
            error "❌ Database is not accepting connections"
            return 2
        fi
    else
        warn "⚠️ pg_isready not found, skipping database check"
        return 1
    fi
}

check_redis() {
    log "Checking Redis connectivity..."
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping | grep -q "PONG"; then
            log "✅ Redis is responding"
            return 0
        else
            error "❌ Redis is not responding"
            return 2
        fi
    else
        warn "⚠️ redis-cli not found, skipping Redis check"
        return 1
    fi
}

check_docker_services() {
    log "Checking Docker services..."
    
    if command -v docker-compose &> /dev/null; then
        if docker-compose ps --services | grep -q .; then
            SERVICES=$(docker-compose ps --format table)
            log "Docker services status:"
            echo "$SERVICES"
            
            # Check if any services are not running
            if docker-compose ps | grep -q "Exit"; then
                warn "⚠️ Some Docker services have exited"
                return 1
            else
                log "✅ All Docker services are running"
                return 0
            fi
        else
            warn "⚠️ No Docker Compose services found"
            return 1
        fi
    else
        warn "⚠️ docker-compose not found, skipping Docker check"
        return 1
    fi
}

check_disk_space() {
    log "Checking disk space..."
    
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -lt 80 ]; then
        log "✅ Disk usage: ${DISK_USAGE}% (healthy)"
        return 0
    elif [ "$DISK_USAGE" -lt 90 ]; then
        warn "⚠️ Disk usage: ${DISK_USAGE}% (warning)"
        return 1
    else
        error "❌ Disk usage: ${DISK_USAGE}% (critical)"
        return 2
    fi
}

check_memory() {
    log "Checking memory usage..."
    
    if command -v free &> /dev/null; then
        MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100)}')
        
        if [ "$MEMORY_USAGE" -lt 80 ]; then
            log "✅ Memory usage: ${MEMORY_USAGE}% (healthy)"
            return 0
        elif [ "$MEMORY_USAGE" -lt 90 ]; then
            warn "⚠️ Memory usage: ${MEMORY_USAGE}% (warning)"
            return 1
        else
            error "❌ Memory usage: ${MEMORY_USAGE}% (critical)"
            return 2
        fi
    else
        warn "⚠️ free command not found, skipping memory check"
        return 1
    fi
}

check_ssl_certificate() {
    log "Checking SSL certificate..."
    
    if [[ "$APP_URL" == https://* ]]; then
        DOMAIN=$(echo "$APP_URL" | sed 's|https://||' | sed 's|/.*||')
        
        if command -v openssl &> /dev/null; then
            CERT_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d= -f2)
            EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s)
            CURRENT_EPOCH=$(date +%s)
            DAYS_TO_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
            
            if [ "$DAYS_TO_EXPIRY" -gt 30 ]; then
                log "✅ SSL certificate expires in $DAYS_TO_EXPIRY days"
                return 0
            elif [ "$DAYS_TO_EXPIRY" -gt 7 ]; then
                warn "⚠️ SSL certificate expires in $DAYS_TO_EXPIRY days"
                return 1
            else
                error "❌ SSL certificate expires in $DAYS_TO_EXPIRY days"
                return 2
            fi
        else
            warn "⚠️ openssl not found, skipping SSL check"
            return 1
        fi
    else
        log "ℹ️ Not using HTTPS, skipping SSL check"
        return 0
    fi
}

run_performance_check() {
    log "Running performance check..."
    
    # Response time check
    RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' "$APP_URL")
    RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc)
    
    if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
        log "✅ Response time: ${RESPONSE_MS%.*}ms (good)"
    elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
        warn "⚠️ Response time: ${RESPONSE_MS%.*}ms (slow)"
    else
        error "❌ Response time: ${RESPONSE_MS%.*}ms (very slow)"
    fi
    
    # Check for specific performance endpoints
    if curl -sf "$APP_URL/api/metrics" > /dev/null; then
        log "✅ Metrics endpoint available"
    else
        warn "⚠️ Metrics endpoint not available"
    fi
}

# Main execution
main() {
    log "Starting comprehensive health check for Workflo New Project"
    log "============================================================"
    
    OVERALL_STATUS=0
    
    # Run all checks
    check_application || ((OVERALL_STATUS += $?))
    echo
    
    check_database || ((OVERALL_STATUS += $?))
    echo
    
    check_redis || ((OVERALL_STATUS += $?))
    echo
    
    check_docker_services || ((OVERALL_STATUS += $?))
    echo
    
    check_disk_space || ((OVERALL_STATUS += $?))
    echo
    
    check_memory || ((OVERALL_STATUS += $?))
    echo
    
    check_ssl_certificate || ((OVERALL_STATUS += $?))
    echo
    
    run_performance_check || ((OVERALL_STATUS += $?))
    echo
    
    # Summary
    log "============================================================"
    if [ $OVERALL_STATUS -eq 0 ]; then
        log "✅ All health checks passed!"
        exit 0
    elif [ $OVERALL_STATUS -lt 10 ]; then
        warn "⚠️ Health check completed with warnings"
        exit 1
    else
        error "❌ Health check failed with critical issues"
        exit 2
    fi
}

# Help function
show_help() {
    echo "Workflo New Project Health Check Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -u, --url URL      Application URL (default: http://localhost:3000)"
    echo "  -h, --help         Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  APP_URL            Application URL"
    echo "  DB_HOST            Database host"
    echo "  DB_PORT            Database port"
    echo "  DB_USER            Database user"
    echo "  REDIS_HOST         Redis host"
    echo "  REDIS_PORT         Redis port"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            APP_URL="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Check dependencies
if ! command -v curl &> /dev/null; then
    error "curl is required but not installed"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    warn "jq not found, health check details may be limited"
fi

# Run main function
main