from flask import Blueprint, request, jsonify, session, current_app
from flask_bcrypt import Bcrypt

from utils import (
    carregar_usuarios,
    salvar_usuarios,
    carregar_reagentes,
    salvar_reagentes,
    gerar_novo_id
)

api_bp = Blueprint("api", __name__)

# usa o bcrypt já configurado no app
bcrypt = Bcrypt()

# ---------- AUTH ----------
@api_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    usuario = data.get("usuario")
    senha = data.get("senha")

    if not usuario or not senha:
        return jsonify({"erro": "Dados inválidos"}), 400

    usuarios = carregar_usuarios()

    if any(u["usuario"] == usuario for u in usuarios):
        return jsonify({"erro": "Usuário já existe"}), 400

    senha_hash = bcrypt.generate_password_hash(senha).decode("utf-8")

    usuarios.append({
        "usuario": usuario,
        "senha": senha_hash
    })

    salvar_usuarios(usuarios)

    session["logged_in"] = True
    session["usuario"] = usuario

    return jsonify({
        "mensagem": "Registrado com sucesso",
        "usuario": usuario
    }), 201


@api_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    usuario = data.get("usuario")
    senha = data.get("senha")

    if not usuario or not senha:
        return jsonify({"erro": "Dados inválidos"}), 400

    usuarios = carregar_usuarios()
    user = next((u for u in usuarios if u["usuario"] == usuario), None)

    if user and bcrypt.check_password_hash(user["senha"], senha):
        session["logged_in"] = True
        session["usuario"] = usuario

        return jsonify({
            "mensagem": "Login OK",
            "usuario": usuario
        }), 200

    return jsonify({"erro": "Credenciais inválidas"}), 401


@api_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"mensagem": "Logout realizado"}), 200


@api_bp.route("/perfil", methods=["GET"])
def perfil():
    if not session.get("logged_in"):
        return jsonify({"erro": "Não autenticado"}), 401

    return jsonify({
        "usuario": session.get("usuario")
    }), 200


# ---------- REAGENTES ----------
@api_bp.route("/reagentes", methods=["GET"])
def listar_reagentes():
    if not session.get("logged_in"):
        return jsonify({"erro": "Não autorizado"}), 401

    return jsonify(carregar_reagentes()), 200


@api_bp.route("/reagentes", methods=["POST"])
def adicionar_reagente():
    if not session.get("logged_in"):
        return jsonify({"erro": "Não autorizado"}), 401

    data = request.get_json() or {}
    reagentes = carregar_reagentes()

    novo = {
        "id": gerar_novo_id(reagentes),
        "nome": data.get("nome"),
        "formula": data.get("formula"),
        "quantidade": data.get("quantidade"),
        "unidade": data.get("unidade"),
        "observacoes": data.get("observacoes")
    }

    reagentes.append(novo)
    salvar_reagentes(reagentes)

    return jsonify(novo), 201
