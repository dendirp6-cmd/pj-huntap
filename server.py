import http.server
import socketserver
import webbrowser
import socket
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Does not actually connect, just determines route
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    os.chdir(DIRECTORY)
    local_ip = get_local_ip()
    
    # Allow port reuse
    socketserver.TCPServer.allow_reuse_address = True
    
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        url_local = f"http://localhost:{PORT}"
        url_hp = f"http://{local_ip}:{PORT}"
        
        print("=" * 70)
        print("  e-HUNTAP VERIKOST - Sistem Pengadaan Darurat PKP")
        print("  Pembangunan 40 Unit Huntap Aceh Tenggara (PerLKPP No. 6/2024)")
        print("=" * 70)
        print(f"  [💻 Laptop/PC]  Buka di : {url_local}")
        print(f"  [📱 HP / Ponsel] Buka di : {url_hp}")
        print("=" * 70)
        print("  *Catatan untuk HP: Pastikan HP dan Laptop terhubung ke Wi-Fi yang sama.")
        print("  Tekan Ctrl+C untuk menghentikan server.")
        print("=" * 70)
        
        try:
            webbrowser.open(url_local)
        except Exception:
            pass
            
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")
            sys.exit(0)

if __name__ == "__main__":
    run()
