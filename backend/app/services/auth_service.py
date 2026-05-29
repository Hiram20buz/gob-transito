import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from app.db.firebase import firebase_db
from app.services.user_service import get_user_by_email, COLLECTION_NAME as USER_COLLECTION
from app.utils.security import get_password_hash
from app.core.config import settings

CODE_COLLECTION = "recovery_codes"

def _get_db():
    return firebase_db.get_db()

def _send_recovery_email(to_email: str, code: str):
    """Envía el correo de recuperación usando SMTP."""
    if not settings.SMTP_HOST:
        print("⚠️ Variables SMTP no configuradas en el .env.")
        print(f"⚠️ Simulando correo a {to_email} -> Código: {code}")
        return

    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_FROM_EMAIL
    msg['To'] = to_email
    msg['Subject'] = "Código de recuperación de contraseña - FastRoute"

    body = f"""
    Hola,
    
    Has solicitado recuperar tu contraseña en FastRoute.
    Tu código de recuperación es: {code}
    
    Este código expirará en 15 minutos. Si no solicitaste este cambio, ignora este correo.
    """
    msg.attach(MIMEText(body, 'plain', 'utf-8'))

    try:
        # Conectar al servidor SMTP
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls() # Seguridad
        
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            
        server.send_message(msg)
        server.quit()
        print(f"✅ Correo enviado exitosamente a {to_email}")
    except Exception as e:
        print(f"❌ Error al enviar correo a {to_email}: {e}")
        # No lanzamos excepción HTTP aquí para no romper el flujo del usuario
        # en caso de que el proveedor de correos falle temporalmente.

def request_password_recovery(email: str):
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Correo inválido"
        )

    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)

    db = _get_db()
    db.collection(CODE_COLLECTION).document(email).set({
        "code": code,
        "expires_at": expires_at,
        "email": email
    })

    # Enviar el correo usando SMTP
    _send_recovery_email(email, code)
    
    return {"message": "Código enviado exitosamente"}

def verify_recovery_code(email: str, code: str):
    db = _get_db()
    doc_ref = db.collection(CODE_COLLECTION).document(email)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Código inválido o no has solicitado un cambio de contraseña"
        )

    data = doc.to_dict()
    if data["code"] != code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El código es incorrecto"
        )

    if datetime.now(timezone.utc) > data["expires_at"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="El código ha expirado. Por favor solicita uno nuevo."
        )

    return {"message": "Código válido"}

def reset_password(email: str, code: str, new_password: str):
    # Verificamos que el código sea válido nuevamente antes de cambiar la contraseña
    verify_recovery_code(email, code)

    # Buscamos el ID real del usuario en Firestore
    db = _get_db()
    users_ref = db.collection(USER_COLLECTION)
    from google.cloud.firestore_v1.base_query import FieldFilter
    query = users_ref.where(filter=FieldFilter("correo_electronico", "==", email)).limit(1).stream()

    doc_id = None
    for doc in query:
        doc_id = doc.id
        break

    if not doc_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Usuario no encontrado"
        )

    # Hasheamos la nueva contraseña y actualizamos el documento
    hashed_pwd = get_password_hash(new_password)
    users_ref.document(doc_id).update({"hashed_password": hashed_pwd})

    # Eliminamos el código para que no pueda ser reutilizado
    db.collection(CODE_COLLECTION).document(email).delete()

    return {"message": "Contraseña actualizada exitosamente"}