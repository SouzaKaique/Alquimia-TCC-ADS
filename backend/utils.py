import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

USERS_FILE = os.path.join(BASE_DIR, "user.json")
REAGENTES_FILE = os.path.join(BASE_DIR, "reagentes.json")


def carregar_usuarios():
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


def salvar_usuarios(data):
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def carregar_reagentes():
    try:
        with open(REAGENTES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except:
        return []


def salvar_reagentes(data):
    with open(REAGENTES_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def gerar_novo_id(lista):
    return max([item.get("id", 0) for item in lista], default=0) + 1
