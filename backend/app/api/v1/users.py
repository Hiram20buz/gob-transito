from fastapi import APIRouter, status
from typing import List

from app.schemas.user import (
    UserCreate, 
    UserResponse, 
    UserLogin,
    PasswordRecoveryRequest,
    PasswordRecoveryVerify,
    PasswordReset
)
from app.services import user_service, auth_service

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_new_user(user: UserCreate):
    """
    Crea un nuevo usuario validando el formato de fecha (DD/MM/YYYY) y
    almacenando el hash de la contraseña en Firestore.
    """
    return user_service.create_user(user)

@router.post("/login", response_model=UserResponse)
def login_user(login_data: UserLogin):
    """
    Inicia sesión verificando el correo electrónico y la contraseña.
    """
    return user_service.authenticate_user(login_data)

@router.post("/password-recovery")
def request_password_recovery(payload: PasswordRecoveryRequest):
    """Genera un código de 6 dígitos y simula el envío por correo."""
    return auth_service.request_password_recovery(payload.correo_electronico)

@router.post("/verify-recovery-code")
def verify_recovery_code(payload: PasswordRecoveryVerify):
    """Verifica si el código ingresado es correcto y no ha expirado."""
    return auth_service.verify_recovery_code(payload.correo_electronico, payload.code)

@router.post("/reset-password")
def reset_password(payload: PasswordReset):
    """Actualiza la contraseña en la base de datos tras verificar el código."""
    return auth_service.reset_password(
        payload.correo_electronico, 
        payload.code, 
        payload.new_password
    )

@router.get("", response_model=List[UserResponse])
def get_all_users():
    """
    Obtiene la lista de todos los usuarios registrados (sin devolver la contraseña).
    """
    return user_service.get_users()

@router.get("/{user_id}", response_model=UserResponse)
def get_single_user(user_id: str):
    """
    Obtiene los datos públicos de un usuario específico mediante su ID.
    """
    return user_service.get_user(user_id)
