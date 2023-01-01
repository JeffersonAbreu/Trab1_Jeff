import axios from "axios";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import FormInstrutor from "../../components/instrutores/FormInstrutor";
import InformModal from "../../components/InformModal";
import { authHeader } from "../../services/authServices";

const Alteracao = () => {
    const [inputs, setInputs] = useState({});
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(undefined);
    const navigate = useNavigate();

    const idInstrutor = useParams().id;
    if (!idInstrutor) {
        navigate("/listagem");
    }

    //https://github.com/jquense/yup
    const validator = yup.object().shape({
        nome: yup.string().required("Nome é obrigatório."),
        dataNascimento: yup.date().required("Data de nascimento é obrigatória."),
        sexo: yup.string().oneOf(["M", "F", "O"], "Gênero está incorreto.").required("Gênero é obrigatório."),
        email: yup.string().email("E-mail inválido.").required("E-mail é obrigatório."),
        //durante a alteração, senha e confSenha não são obrigatórios
        // senha: yup.string().min(6, "Senha deve ter pelo menos 6 caracteres.").max(12, "Senha deve ter no máximo 12 caracteres.").required("Senha é obrigatória."),
        // confSenha: yup
        //     .string()
        //     .oneOf([yup.ref("senha"), null], "Confirmação de Senha e Senha devem ser iguais.")
        //     .required("Confirmação de Senha é obrigatória."),
        ativo: yup.boolean().required("Situação é obrigatória."),
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
                    .put(`http://localhost:8080/api/instrutores/${idInstrutor}`, inputs, { headers: authHeader() })
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
        navigate("/instrutores");
    }

    useEffect(() => {
        const informModal = new bootstrap.Modal("#informModal", {});
        setModal(informModal);
        setInputs({ ...inputs, id: idInstrutor });
        axios
            .get(`http://localhost:8080/api/instrutores/${idInstrutor}`, { headers: authHeader() })
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
                <h1>Alteração de Instrutor</h1>
            </div>
            <hr />
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
                <FormInstrutor handleChange={handleChange} inputs={inputs} errors={errors} />
                <div className="mt-3">
                    <Link to="/instrutores" className="btn btn-secondary me-1">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-primary">
                        Salvar
                    </button>
                </div>
            </form>
            <InformModal info="Instrutor alterado com sucesso!" action={closeModalAndRedirect} />
        </>
    );
};

export default Alteracao;