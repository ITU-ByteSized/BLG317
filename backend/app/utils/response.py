from flask import jsonify
from typing import Any, Dict


def ok(data: Any = None) -> Any:
	payload: Dict[str, Any] = {"ok": True}
	if data is not None:
		payload["data"] = data
	return jsonify(payload)


def error(message: str, code: int = 400) -> Any:
	return jsonify({"ok": False, "error": message}), code
