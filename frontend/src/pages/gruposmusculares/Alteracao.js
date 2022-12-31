import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import FormGrupoMuscular from "../../components/gruposmusculares/FormGrupoMuscular";
import InformModal from "../../components/InformModal";
import { authHeader } from "../../services/authServices";

const Alteracao = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(undefined);
    const navigate = useNavigate();

    const idGrupoMuscular = useParams().id;
    if (!idGrupoMuscular) {
        navigate("/gruposmusculares");
    }

    //https://github.com/jquense/yup
    const validator = yup.object().shape({
        nome: yup.string().required("Nome é obrigatório."),
    });

    function handleChange(event) {
        //rawValue é o valor sem máscara e value é o valor com máscara
        const value = event.target.rawValue ? event.target.rawValue : event.target.value;
        const name = event.target.name;
        setInputs({ ...inputs, [name]: value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        validator
            .validate(inputs, { abortEarly: false })
            .then(() => {
                setErrors({});
                axios
                    .put(`http://localhost:8080/api/gruposmusculares/${idGrupoMuscular}`, inputs, { headers: authHeader() })
                    .then((response) => {
                        if (response.status === 200) {
                            modal.show();
                        } else {
                            console.log(response);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                setErrors({});
                error.inner.forEach((err) => {
                    setErrors((prevErrors) => ({ ...prevErrors, [err.path]: err.message }));
                });
            });
    }

    function closeModalAndRedirect() {
        modal.hide();
        navigate("/gruposmusculares");
    }

    useEffect(() => {
        const informModal = new bootstrap.Modal("#informModal", {});
        setModal(informModal);
        setInputs({ ...inputs, id: idGrupoMuscular });
        axios
            .get(`http://localhost:8080/api/gruposmusculares/${idGrupoMuscular}`, { headers: authHeader() })
            .then((response) => {
                if (response.status === 200) {
                    setInputs(response.data);
                } else {
                    console.log(response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (Object.keys(inputs).length > 0) {
            validator
                .validate(inputs, { abortEarly: false })
                .then(() => {
                    //necessário porque quando corrigia o último erro, ele não era eliminado
                    setErrors({});
                })
                .catch((error) => {
                    setErrors({});
                    error.inner.forEach((err) => {
                        setErrors((prevErrors) => ({ ...prevErrors, [err.path]: err.message }));
                    });
                });
        }
    }, [inputs]);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Alteração de Grupo Muscular</h1>
            </div>
            <hr />
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <FormGrupoMuscular handleChange={handleChange} inputs={inputs} errors={errors} />
                <div className="mt-3">
                    <Link to="/gruposmusculares" className="btn btn-secondary me-1">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        Salvar
                    </button>
                </div>
            </form>
            <InformModal info="Grupo Muscular alterado com sucesso!" action={closeModalAndRedirect} />
        </>
    );
};

export default Alteracao;
