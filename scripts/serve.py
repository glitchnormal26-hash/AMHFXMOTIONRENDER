#!/usr/bin/env python3
"""
No-cache development server for the Motion Designer runtime bundle.

Usage:
  python scripts/serve.py
  python scripts/serve.py 8080

This is a development convenience only. Final single-file browser deliverables
should not require this server unless the project intentionally uses local
modules/assets that cannot run under file://.
"""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    print(f"Serving current directory on http://127.0.0.1:{PORT} (no-cache)")
    ThreadingHTTPServer(("127.0.0.1", PORT), NoCacheHandler).serve_forever()
