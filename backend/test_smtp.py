import os
import smtplib
from dotenv import load_dotenv

def test_smtp_connection():
    load_dotenv()
    
    host = os.getenv("SMTP_HOST")
    port = int(os.getenv("SMTP_PORT", "587"))
    user = os.getenv("SMTP_USER")
    password = os.getenv("SMTP_PASSWORD")
    
    print(f"Intentando conectar a SMTP...")
    print(f"Host: {host}")
    print(f"Puerto: {port}")
    print(f"Usuario: {user}")
    
    if not host or not user or not password:
        print("❌ Faltan variables en el .env. Asegúrate de tener SMTP_HOST, SMTP_PORT, SMTP_USER y SMTP_PASSWORD")
        return

    try:
        print("\n1. Conectando al servidor...")
        server = smtplib.SMTP(host, port)
        server.set_debuglevel(1) # Esto imprimirá todo el log de la conexión
        
        print("\n2. Iniciando TLS (Seguridad)...")
        server.starttls()
        
        print("\n3. Iniciando sesión...")
        server.login(user, password)
        
        print("\n✅ ¡CONEXIÓN SMTP EXITOSA! Las credenciales son correctas.")
        server.quit()
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"\n❌ ERROR DE AUTENTICACIÓN: Usuario o contraseña incorrectos.")
        print(f"Detalle: {e}")
    except Exception as e:
        print(f"\n❌ ERROR DE CONEXIÓN:")
        print(f"Detalle: {e}")

if __name__ == "__main__":
    test_smtp_connection()
