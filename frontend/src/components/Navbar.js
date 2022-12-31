import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { getUser } from "../services/authServices";

const Navbar = () => {
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        const usuario = getUser();
        setUsuario(usuario);
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-3 sticky-top">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <span className="fs-3 bg-white rounded me-2">🏋</span>
                        <span className="fs-3">Academia</span>
                    </Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navMenu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navMenu">
                        <div className="navbar-nav">
                            <NavLink to="/" className="nav-link">
                                Principal
                            </NavLink>
                            <NavLink to="/alunos" className="nav-link">
                                Alunos
                            </NavLink>
                            <NavLink to="/exercicios" className="nav-link">
                                Exercícios
                            </NavLink>
                            <NavLink to="/fichas" className="nav-link">
                                Fichas
                            </NavLink>
                            <NavLink to="/gruposmusculares" className="nav-link">
                                Grupos Musculares
                            </NavLink>
                            <NavLink to="/instrutores" className="nav-link">
                                Instrutores
                            </NavLink>
                            <NavLink to="/tiposexercicios" className="nav-link">
                                Tipos Exercícios
                            </NavLink>
                            {usuario.ativo && (
                                <NavLink to="/ativos" className="nav-link">
                                    Ativos
                                </NavLink>
                            )}
                            <Link to="/logout" className="nav-link">
                                Sair
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
