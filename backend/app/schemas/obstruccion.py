from pydantic import BaseModel


class ObstruccionResponse(BaseModel):
    id: str
    user_id: str
    latitud: float
    longitud: float
    photo_url: str
    created_at: str
