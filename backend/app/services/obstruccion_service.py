import uuid
from datetime import datetime, timezone

from fastapi import UploadFile

from app.db.firebase import firebase_db
from app.db.storage import cloud_storage


async def crear_obstruccion(user_id: str, latitud: float, longitud: float, foto: UploadFile) -> dict:
    content = await foto.read()
    ext = (foto.content_type or 'image/jpeg').split('/')[-1]
    file_name = f"obstruccion_{uuid.uuid4().hex}.{ext}"
    photo_url = cloud_storage.upload_file(content, file_name, foto.content_type or 'image/jpeg')

    db = firebase_db.get_db()
    obstruccion_data = {
        'user_id': user_id,
        'latitud': latitud,
        'longitud': longitud,
        'photo_url': photo_url,
        'created_at': datetime.now(timezone.utc).isoformat(),
    }
    doc_ref = db.collection('obstrucciones').document()
    doc_ref.set(obstruccion_data)

    return {'id': doc_ref.id, **obstruccion_data}
