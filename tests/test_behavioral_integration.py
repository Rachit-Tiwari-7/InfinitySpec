"""
Behavioral Integration Test Suite for INFINITY Spatial OS.
Runs true runtime behavioral tests against mathematical algorithms,
geometric state machines, and data serialization engines via Node.js.
"""
import os
import subprocess
import pytest


def test_node_behavioral_engine_execution():
    """Executes the 12-test behavioral verification suite in Node.js."""
    script_path = os.path.join(os.path.dirname(__file__), "test_behavioral_engine.js")
    assert os.path.exists(script_path), "Missing tests/test_behavioral_engine.js"

    res = subprocess.run(["node", script_path], capture_output=True, text=True)
    assert res.returncode == 0, f"Behavioral test suite failed:\n{res.stdout}\n{res.stderr}"
    assert "All 12/12 Behavioral Tests PASSED!" in res.stdout
