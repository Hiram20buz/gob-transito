from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.obstruccion import ObstruccionResponse
from app.services.obstruccion_service import crear_obstruccion

router = APIRouter(prefix="/obstrucciones", tags=["Obstrucciones"])


@router.post("", response_model=ObstruccionResponse, status_code=201)
async def reportar_obstruccion(
    user_id: str = Form(...),
    latitud: float = Form(...),
    longitud: float = Form(...),
    foto: UploadFile = File(...),
):
    if not foto.content_type or not foto.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen.")
    try:
        return await crear_obstruccion(user_id, latitud, longitud, foto)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar la obstrucción: {e}")
