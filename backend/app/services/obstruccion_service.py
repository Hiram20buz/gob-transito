import uuid

from fastapi import UploadFile

from app.db.storage import cloud_storage


async def crear_obstruccion(user_id: str, latitud: float, longitud: float, timestamp: str, foto: UploadFile) -> dict:
    content = await foto.read()
    ext = (foto.content_type or 'image/jpeg').split('/')[-1]
    record_id = uuid.uuid4().hex
    file_name = f"obstruccion_{record_id}.{ext}"
    photo_url = cloud_storage.upload_file(content, file_name, foto.content_type or 'image/jpeg')

    return {
        'id': record_id,
        'user_id': user_id,
        'latitud': latitud,
        'longitud': longitud,
        'photo_url': photo_url,
        'created_at': timestamp,
    }
