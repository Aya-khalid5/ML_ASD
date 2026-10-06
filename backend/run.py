import os
import subprocess
import sys

port = os.environ.get("PORT", "8501")

subprocess.run([
    sys.executable,
    "-m",
    "streamlit",
    "run",
    "app.py",
    "--server.address=0.0.0.0",
    f"--server.port={port}",
])
