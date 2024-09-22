import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Projetos({ auth }) {
    const [formVisible, setFormVisible] = useState(false);
    const [projetosList, setProjetosList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProjeto, setSelectedProjeto] = useState(null); 
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); 
    const [isEditingModalOpen, setIsEditingModalOpen] = useState(false); 
    const [tasks, setTasks] = useState([]); 

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
    } = useForm({
        id: "",
        nome: "",
        descricao: "",
        dt_entrega: "",
    });

    const fetchProjetosList = async () => {
        try {
            const response = await axios.get("/api/projetos/list");
            setProjetosList(response.data);
        } catch (error) {
            console.error("Erro ao consumir a API:", error);
        }
    };

    const fetchTasks = async (projetoId) => {
        try {
            const response = await axios.get(`/api/projetos/${projetoId}/tasks`);
            console.log("Tarefas carregadas:", response.data);
            setTasks(response.data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        }
    };
    useEffect(() => {
        fetchProjetosList();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route("projetos.update", data.id), {
                onSuccess: () => {
                    setFormVisible(false);
                    setData({
                        id: "",
                        nome: "",
                        descricao: "",
                        dt_entrega: "",
                    });
                    setIsEditing(false);
                    fetchProjetosList();
                },
            });
        } else {
            post(route("projetos.store"), {
                onSuccess: () => {
                    setFormVisible(false);
                    setData({ nome: "", descricao: "", dt_entrega: "" });
                    fetchProjetosList();
                },
            });
        }
    };

    const handleEdit = (projeto) => {
        setData({
            id: projeto.id,
            nome: projeto.nome,
            descricao: projeto.descricao,
            dt_entrega: projeto.dt_entrega,
        });
        setIsEditingModalOpen(true);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (confirm("Tem certeza que deseja excluir este projeto?")) {
            destroy(route("projetos.destroy", id), {
                onSuccess: () => {
                    setProjetosList(
                        projetosList.filter((projeto) => projeto.id !== id)
                    );
                },
            });
        }
    };

    const handleDetails = (projeto) => {
        setSelectedProjeto(projeto);
        fetchTasks(projeto.id);
        setIsDetailsModalOpen(true); 
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedProjeto(null);
        setTasks([]);
    };

    const handleCloseEditingModal = () => {
        setIsEditingModalOpen(false);
        setData({
            id: "",
            nome: "",
            descricao: "",
            dt_entrega: "",
        });
        setIsEditing(false);
    };


    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Projetos" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-center text-xl font-bold mb-4">
                            Projetos
                        </h2>

                        <button
                            onClick={() => setFormVisible(!formVisible)}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        >
                            {formVisible ? "Cancelar" : "Novo Projeto"}
                        </button>

                        {formVisible && (
                            <form onSubmit={handleSubmit} className="mb-4">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nome}
                                        onChange={(e) =>
                                            setData("nome", e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-full"
                                        required
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">
                                        Descrição
                                    </label>
                                    <textarea
                                        value={data.descricao}
                                        onChange={(e) =>
                                            setData("descricao", e.target.value)
                                        }
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium">
                                        Data de Entrega
                                    </label>
                                    <input
                                        type="date"
                                        value={data.dt_entrega}
                                        onChange={(e) =>
                                            setData(
                                                "dt_entrega",
                                                e.target.value
                                            )
                                        }
                                        className="border rounded px-2 py-1 w-full"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Salvando..."
                                        : isEditing
                                        ? "Atualizar Projeto"
                                        : "Salvar Projeto"}
                                </button>
                            </form>
                        )}

                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b py-2">Nome</th>
                                    <th className="border-b py-2">Descrição</th>
                                    <th className="border-b py-2">
                                        Data de Entrega
                                    </th>
                                    <th className="border-b py-2">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projetosList.map((projeto) => (
                                    <tr key={projeto.id}>
                                        <td className="text-center border-b py-2">
                                            {projeto.nome}
                                        </td>
                                        <td className="text-center border-b py-2">
                                            {projeto.descricao}
                                        </td>
                                        <td className="text-center border-b py-2">
                                            {projeto.dt_entrega}
                                        </td>
                                        <td className="border-b py-2">
                                            <button
                                                onClick={() =>
                                                    handleDetails(projeto)
                                                }
                                                className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Exibir
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleEdit(projeto)
                                                }
                                                className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(projeto.id)
                                                }
                                                className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        
                        {isDetailsModalOpen && selectedProjeto && (
                            <div className="fixed z-10 inset-0 overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h2 className="text-xl font-semibold mb-4">
                                            Detalhes do Projeto
                                        </h2>
                                        <p><strong>Nome:</strong> {selectedProjeto.nome}</p>
                                        <p><strong>Descrição:</strong> {selectedProjeto.descricao}</p>
                                        <p><strong>Data de Entrega:</strong> {selectedProjeto.dt_entrega}</p>
                                        <h3 className="text-lg font-semibold mt-4">Tarefas:</h3>
                                        <ul>
                                            {tasks.length > 0 ? (
                                                tasks.map((task) => (
                                                    <li key={task.id}>
                                                        {task.nome} - {task.status}
                                                    </li>
                                                ))
                                            ) : (
                                                <p>Nenhuma tarefa encontrada.</p>
                                            )}
                                        </ul>
                                        <button
                                            onClick={handleCloseDetailsModal}
                                            className="mt-4 bg-gray-300 px-4 py-2 rounded"
                                        >
                                            Fechar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                      
                        {isEditingModalOpen && (
                            <div className="fixed z-10 inset-0 overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h2 className="text-xl font-semibold mb-4">
                                            Editar Projeto
                                        </h2>
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">
                                                    Nome
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.nome}
                                                    onChange={(e) =>
                                                        setData("nome", e.target.value)
                                                    }
                                                    className="border rounded px-2 py-1 w-full"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">
                                                    Descrição
                                                </label>
                                                <textarea
                                                    value={data.descricao}
                                                    onChange={(e) =>
                                                        setData("descricao", e.target.value)
                                                    }
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </div>
                                            <div className="mb-2">
                                                <label className="block text-sm font-medium">
                                                    Data de Entrega
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.dt_entrega}
                                                    onChange={(e) =>
                                                        setData(
                                                            "dt_entrega",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border rounded px-2 py-1 w-full"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="bg-green-500 text-white px-4 py-2 rounded"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? "Atualizando..."
                                                    : "Atualizar Projeto"}
                                            </button>
                                        </form>
                                        <button
                                            onClick={handleCloseEditingModal}
                                            className="mt-4 bg-gray-300 px-4 py-2 rounded"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
