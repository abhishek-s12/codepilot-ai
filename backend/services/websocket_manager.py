import asyncio
from datetime import datetime
import json
import time
from fastapi import WebSocket
from services.redis_service import get_redis


class ConnectionManager:
    def __init__(self):
        # Maps project_id -> list of WebSocket connections
        self.active_connections: dict[str, list[WebSocket]] = {}
        # Maps websocket -> last seen timestamp for heartbeats
        self.last_seen: dict[WebSocket, float] = {}
        # Maps project_id -> Redis Pub/Sub subscription Task
        self.listeners: dict[str, asyncio.Task] = {}
        # Maps websocket -> heartbeat loop Task
        self.heartbeat_tasks: dict[WebSocket, asyncio.Task] = {}

    async def connect(self, websocket: WebSocket, project_id: str):
        await websocket.accept()

        if project_id not in self.active_connections:
            self.active_connections[project_id] = []
        self.active_connections[project_id].append(websocket)
        self.last_seen[websocket] = time.time()

        # Start heartbeat loop for this connection
        self.heartbeat_tasks[websocket] = asyncio.create_task(
            self.heartbeat_loop(websocket, project_id)
        )

        # Start Redis Pub/Sub listener if not already running for this project
        if project_id not in self.listeners or self.listeners[project_id].done():
            self.listeners[project_id] = asyncio.create_task(
                self.redis_pubsub_listener(project_id)
            )
            print(
                f"[WS Manager] Spawned Redis Pub/Sub listener for project {project_id}"
            )

    async def disconnect(self, websocket: WebSocket, project_id: str):
        # Remove from active connections
        if project_id in self.active_connections:
            if websocket in self.active_connections[project_id]:
                self.active_connections[project_id].remove(websocket)
            if not self.active_connections[project_id]:
                del self.active_connections[project_id]
                # Cleanup idle Redis listener
                if project_id in self.listeners:
                    self.listeners[project_id].cancel()
                    del self.listeners[project_id]
                    print(
                        f"[WS Manager] Cleaned up idle Redis listener for project {project_id}"
                    )

        # Cleanup heartbeat task
        if websocket in self.heartbeat_tasks:
            self.heartbeat_tasks[websocket].cancel()
            del self.heartbeat_tasks[websocket]

        if websocket in self.last_seen:
            del self.last_seen[websocket]

        try:
            await websocket.close()
        except Exception:
            pass

    async def heartbeat_loop(self, websocket: WebSocket, project_id: str):
        try:
            while True:
                await asyncio.sleep(30)
                # Send ping
                try:
                    await websocket.send_json(
                        {
                            "type": "ping",
                            "timestamp": datetime.utcnow().isoformat() + "Z",
                        }
                    )
                except Exception:
                    print("[WS Manager] Ping failed. Disconnecting stale socket.")
                    await self.disconnect(websocket, project_id)
                    break

                # Check if client is responsive (45 seconds timeout)
                last_active = self.last_seen.get(websocket, 0)
                if time.time() - last_active > 45:
                    print(
                        f"[WS Manager] Client heartbeat timeout (45s) for {project_id}. Forcing disconnect."
                    )
                    await self.disconnect(websocket, project_id)
                    break
        except asyncio.CancelledError:
            pass

    def record_pong(self, websocket: WebSocket):
        self.last_seen[websocket] = time.time()

    async def broadcast_to_project(self, message: dict, project_id: str):
        """Broadcasts event payload to all clients connected to a project, isolating errors."""
        if project_id not in self.active_connections:
            return

        sockets = list(self.active_connections[project_id])
        for ws in sockets:
            try:
                await ws.send_json(message)
            except Exception as e:
                print(
                    f"[WS Manager] Failed to send broadcast message to socket, removing: {e}"
                )
                await self.disconnect(ws, project_id)

    async def redis_pubsub_listener(self, project_id: str):
        """Subscribes to Redis Pub/Sub for a specific project and broadcasts incoming messages."""
        try:
            client = get_redis()
            if client is None:
                print(
                    f"[WS Manager] Redis unavailable. Listener for project {project_id} exiting."
                )
                return

            pubsub = client.pubsub()
            channel = f"project_events:{project_id}"
            pubsub.subscribe(channel)

            while True:
                # Non-blocking pull check
                message = pubsub.get_message(
                    ignore_subscribe_messages=True, timeout=0.5
                )
                if message and message["type"] == "message":
                    try:
                        data = json.loads(message["data"])
                        await self.broadcast_to_project(data, project_id)
                    except Exception as err:
                        print(f"[WS Manager] Error parsing Pub/Sub message: {err}")

                await asyncio.sleep(0.05)

        except asyncio.CancelledError:
            print(f"[WS Manager] Redis listener cancelled for project {project_id}")
        except Exception as e:
            print(
                f"[WS Manager] Redis Pub/Sub listener error on project {project_id}: {e}"
            )


manager = ConnectionManager()
