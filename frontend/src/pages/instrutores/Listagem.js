import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableInstrutores from "../../components/instrutores/TableInstrutores";
import Loading from "../../components/Loading";
import { authHeader } from "../../services/authServices";
import "./Listagem.css";

const Listagem = () => {
    const [instrutores, setInstrutores] = useState([]);
    const [loading, setLoading] = useState(true);

    const carregarInstrutores = () => {
        axios
            .get("http://localhost:8080/api/instrutores", { headers: authHeader() })
            .then((response) => {
                setInstrutores(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        carregarInstrutores();
    }, []);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Instrutores</h1>
                <Link to="/instrutores/cadastrar" className="btn btn-primary">
                    Novo
                </Link>
            </div>
            <hr />
            {loading ? <Loading /> : <TableInstrutores instrutores={instrutores} setInstrutores={setInstrutores} />}
        </>
    );
}

export default Listagem;