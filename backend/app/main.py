import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Importar configuración, base de datos y rutas
from app.core.config import settings
from app.db.firebase import firebase_db
from app.db.storage import cloud_storage
from app.api.v1 import users

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    firebase_db.initialize()
    cloud_storage.initialize()
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS abierto: permite peticiones desde cualquier origen, método y header.
# Nota: cuando allow_origins=["*"] el navegador NO acepta credentials,
# por eso allow_credentials queda en False.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Sobrescribe el Referrer-Policy por defecto (strict-origin-when-cross-origin)
# para que el navegador mande el referrer completo sin restricciones.
@app.middleware("http")
async def relax_referrer_policy(request: Request, call_next):
    response = await call_next(request)
    response.headers["Referrer-Policy"] = "unsafe-url"
    return response

# Registrar enrutadores (Rutas de la API)
app.include_router(users.router, prefix="/api/v1")

@app.get("/health", status_code=200, tags=["Health"])
def health_check():
    db = firebase_db.get_db()
    db_status = "conectado" if db else "desconectado"
    return {"status": "vivo", "database": db_status}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
