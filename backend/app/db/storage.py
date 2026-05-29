import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

class CloudStorage:
    """
    Singleton para manejar la conexión a Cloudflare R2 / AWS S3 usando boto3.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CloudStorage, cls).__new__(cls)
            cls._instance.client = None
        return cls._instance

    def initialize(self):
        """Inicializa el cliente de boto3."""
        if self.client is None:
            if not settings.AWS_ACCESS_KEY_ID or not settings.AWS_SECRET_ACCESS_KEY or not settings.BUCKET_URL:
                print("⚠️ Variables de S3/Cloudflare no están completamente configuradas en el .env.")
                return

            print(f"Inicializando conexión a Storage Bucket en {settings.BUCKET_URL}...")
            
            # Crear el cliente S3 apuntando a la BUCKET_URL (que sirve como endpoint para R2/AWS)
            self.client = boto3.client(
                service_name='s3',
                endpoint_url=settings.BUCKET_URL,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                aws_session_token=settings.AWS_SESSION_TOKEN, # Opcional
            )
            print("Storage inicializado correctamente.")

    def get_client(self):
        """Retorna el cliente boto3."""
        if self.client is None:
            self.initialize()
        return self.client

    def upload_file(self, file_content: bytes, file_name: str, content_type: str = "image/jpeg"):
        """
        Sube un archivo a la carpeta /images en el bucket configurado.
        """
        s3_client = self.get_client()
        if not s3_client:
            raise Exception("El cliente de Storage no pudo ser inicializado.")

        # Guardarlo dentro del folder /images
        object_name = f"images/{file_name}"
        
        try:
            s3_client.put_object(
                Bucket=settings.BUCKET_NAME,
                Key=object_name,
                Body=file_content,
                ContentType=content_type,
            )
            # Retorna la ruta relativa o la URL en caso de que sea público
            # Dependiendo de tu configuración de bucket público, la URL base podría ser diferente
            return object_name
        except ClientError as e:
            print(f"Error al subir archivo a Storage: {e}")
            raise Exception(f"No se pudo subir la imagen: {e}")

# Instancia global del Singleton
cloud_storage = CloudStorage()
