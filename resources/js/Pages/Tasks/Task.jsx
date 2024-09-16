import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Projetos({ auth }) {
    const { tasks: initialTasks, projects: initialProjects } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const [showUserAssignModal, setShowUserAssignModal] = useState(false);
    const [tasks, setTasks] = useState(initialTasks || []);
    const [projects, setProjects] = useState(initialProjects || []);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);  
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);  
    const { data, setData, post, errors } = useForm({
        name: "",
        description: "",
        status: "",
        project: "",
    });

    

     
    useEffect(() => {
        axios
            .get("/users")
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Erro ao buscar usuários:", error));
    }, []);

    useEffect(() => {
        fetch("/api/projetos/list")
            .then((response) => response.json())
            .then((data) => setProjects(data))
            .catch((error) => console.error("Erro ao consumir a API:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(false);

        if (isEditing && currentTaskId) {
            axios
                .put(route("tasks.update", currentTaskId), data)
                .then(() => {
                    setTasks(
                        tasks.map((task) =>
                            task.id === currentTaskId
                                ? { ...task, ...data }
                                : task
                        )
                    );
                    setShowForm(false);
                    setSubmitSuccess(true);
                    resetForm();  
                })
                .catch(() => {
                    setSubmitError("Erro ao atualizar tarefa.");
                });
        } else {
            post(route("tasks.store", { projeto: data.project }), {
                onSuccess: (response) => {
                    setTasks([...tasks, response.data]);
                    setShowForm(false);
                    setSubmitSuccess(true);
                    resetForm();  
                },
                onError: (error) => setSubmitError("Erro ao cadastrar tarefa."),
            });
        }

        window.location.reload();
    };

    const handleEdit = (task) => {
        setIsEditing(true);
        setCurrentTaskId(task.id);
        setData({
            nome: task.nome,
            descricao: task.descricao,
            status: task.status,
            projeto_id: task.projeto ? task.projeto.id : "",
        });
        setShowForm(true);  
    };

    const handleDelete = (id) => {
        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
            axios
                .delete(route("tasks.destroy", id))
                .then(() => {
                    setTasks(tasks.filter((task) => task.id !== id));
                })
                .catch(() => {
                    console.error("Erro ao excluir tarefa.");
                });
        }
    };

    const assignUserToTask = () => {
        console.log("Atribuir usuário à tarefa", currentTaskId, selectedUserId);
        if (!selectedUserId) return;  
    
        axios
            .put(`/tasks/${currentTaskId}/assign`, { user_id: selectedUserId }) 
            .then(() => {
                const updatedTasks = tasks.map((task) =>
                    task.id === currentTaskId
                        ? { ...task, assigned_user_id: selectedUserId }
                        : task
                );
                setTasks(updatedTasks);
                setShowUserAssignModal(false);  
            })
            .catch((error) => console.error("Erro ao atribuir usuário:", error));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Tarefas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h2 className="text-center text-xl font-bold mb-4">
                            Tarefas
                        </h2>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Cadastrar Nova Tarefa
                        </button>

                        {submitSuccess && (
                            <div className="mt-4 text-green-500">
                                Tarefa cadastrada com sucesso!
                            </div>
                        )}

                        {submitError && (
                            <div className="mt-4 text-red-500">
                                {submitError}
                            </div>
                        )}

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="p-4 border rounded shadow"
                                >
                                    <h3 className="text-center text-lg font-semibold">
                                        {task.nome}
                                    </h3>
                                    <p>{task.descricao}</p>
                                    <p>Status: {task.status}</p>
                                    <p>
                                        Projeto:{" "}
                                        {task.projeto
                                            ? task.projeto.nome
                                            : "Sem projeto"}
                                    </p>
                                    <div className="mt-6 flex justify-around">
                                        <button
                                            onClick={() => handleEdit(task)}
                                            className="bg-yellow-500 text-white py-1 px-3 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(task.id)
                                            }
                                            className="bg-red-500 text-white py-1 px-3 rounded"
                                        >
                                            Excluir
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleAssignUser(task.id)
                                            }
                                            className="bg-green-500 text-white py-1 px-3 rounded"
                                        >
                                            Adicionar Usuário
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showUserAssignModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className=" bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Atribuir Usuário à Tarefa
                        </h2>
                        <select
                            className="w-full mb-4 border border-gray-300 p-2 rounded"
                            value={selectedUserId}
                            onChange={(e) =>
                                setSelectedUserId(e.target.value)
                            }
                        >
                            <option value="">Selecione um usuário</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowUserAssignModal(false)}
                                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={assignUserToTask}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Atribuir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Nome da tarefa"
                                className="w-full mb-4 border border-gray-300 p-2 rounded"
                                value={data.nome}
                                onChange={(e) =>
                                    setData("nome", e.target.value)
                                }
                            />
                            {errors.nome && (
                                <div className="text-red-500 mb-2">
                                    {errors.nome}
                                </div>
                            )}
                            <textarea
                                placeholder="Descrição"
                                className="w-full mb-4 border border-gray-300 p-2 rounded"
                                value={data.descricao}
                                onChange={(e) =>
                                    setData("descricao", e.target.value)
                                }
                            />
                            {errors.descricao && (
                                <div className="text-red-500 mb-2">
                                    {errors.descricao}
                                </div>
                            )}
                            <select
                                className="w-full mb-4 border border-gray-300 p-2 rounded"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                            >
                                <option value="">Selecione o status</option>
                                <option value="pendente">Pendente</option>
                                <option value="concluida">Concluída</option>
                            </select>
                            {errors.status && (
                                <div className="text-red-500 mb-2">
                                    {errors.status}
                                </div>
                            )}
                            <select
                                className="w-full mb-4 border border-gray-300 p-2 rounded"
                                value={data.projeto_id}
                                onChange={(e) =>
                                    setData("projeto_id", e.target.value)
                                }
                            >
                                <option value="">Selecione um projeto</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.projeto_id && (
                                <div className="text-red-500 mb-2">
                                    {errors.projeto_id}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                >
                                    {isEditing ? "Salvar" : "Criar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
