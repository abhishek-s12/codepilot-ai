import pytest
import time
import asyncio
from collections import OrderedDict
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import services.redis_service
from main import RateLimitMiddleware
from services.metrics_service import rate_limit_fallback_total

class MockRequest:
    def __init__(self, host="127.0.0.1", path="/test"):
        self.method = "GET"
        self.url = type("URL", (object,), {"path": path})()
        self.client = type("Client", (object,), {"host": host})()

def test_rate_limiter_lru_capping(monkeypatch):
    # Force redis to be None to activate fallback rate limiting
    monkeypatch.setattr(services.redis_service, "get_redis", lambda: None)

    app = FastAPI()
    # Initialize middleware with limit_seconds=10 and max_keys=2
    middleware = RateLimitMiddleware(app, limit_seconds=10, max_keys=2)
    
    async def call_next(req):
        return JSONResponse({"status": "ok"})
    
    # 1. First client request (host: 1.1.1.1)
    req1 = MockRequest(host="1.1.1.1")
    asyncio.run(middleware.dispatch(req1, call_next))
    assert "1.1.1.1:std" in middleware.local_history
    assert len(middleware.local_history) == 1
    
    # 2. Second client request (host: 2.2.2.2)
    req2 = MockRequest(host="2.2.2.2")
    asyncio.run(middleware.dispatch(req2, call_next))
    assert "2.2.2.2:std" in middleware.local_history
    assert len(middleware.local_history) == 2
    
    # 3. Third client request (host: 3.3.3.3) - should evict oldest (1.1.1.1:std)
    req3 = MockRequest(host="3.3.3.3")
    asyncio.run(middleware.dispatch(req3, call_next))
    assert "3.3.3.3:std" in middleware.local_history
    assert "1.1.1.1:std" not in middleware.local_history
    assert len(middleware.local_history) == 2

def test_rate_limiter_metric_increments(monkeypatch):
    # Force redis to be None to activate fallback rate limiting
    monkeypatch.setattr(services.redis_service, "get_redis", lambda: None)

    app = FastAPI()
    middleware = RateLimitMiddleware(app, limit_seconds=10, max_keys=2)
    
    async def call_next(req):
        return JSONResponse({"status": "ok"})
        
    req = MockRequest(host="4.4.4.4")
    
    # Store initial metric value
    initial_value = rate_limit_fallback_total._value.get()
    
    # Execute request using local fallback
    asyncio.run(middleware.dispatch(req, call_next))
    
    # The rate limit fallback metric should have incremented by 1
    final_value = rate_limit_fallback_total._value.get()
    assert final_value == initial_value + 1
