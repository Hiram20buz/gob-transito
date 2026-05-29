from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(prefix="/maps", tags=["maps"])


@router.get("/health")
def maps_health():
    return {"configured": bool(settings.GOOGLE_MAPS_SERVER_API_KEY)}
